import uuidv4 from 'uuid/v4'
import CHANNELS from './SubscriptionChannels';
import { getUrlMetaData } from '../utils/scrapeUtils';
import { COLLECTIONSTATE } from '../globalEnum';
import { cleanUp } from '../utils/dbUtils'

const Mutation = {
    loginCheck(parent, { data: { email, password }}, { pubsub, dbMock, db: { UserDB } }, info){
        console.log("checking login");
        return UserDB.findOne({ email: email }).exec().then(content => {
            console.log('current user: ',content);
            if(!content) { 
                console.log("email unexist");
                return { status: "EMAIL_UNEXIST_ERROR", id: null };
            }
            if(content.password !== password) 
                return { status: "PASSWORD_UNMATCH_ERROR", id: null };
            return { status: "SUCCESS", id: content.id };
        }).catch(err => console.log(err));
    },
    createUser(parent, { data }, { pubsub, db: { UserDB }, dbMock }, info){
        console.log("[createUser] ");
        const { id, name, email, avatar, password } = data
        const userData = {
            id: id,
            name: name,
            email: email,
            avatar: avatar,
            password: password,
            following: [],
            followers: []
        }
        const newUser = new UserDB(userData);
        return UserDB.findOne({email:email}).exec().then(result => {
            if(!result){
                newUser.save(err=>err?console.log(err):console.log("Successfully add user"));
                return {status:"CREATE_USER_SUCCESS"};
            }
            else {
                console.log("duplicated email");
                return {status:"DUPLICATE_EMAIL_ERROR"};
            }
        }).catch(err=>console.log(err));
    },
    async updateCollection(parent, { collectionId, data }, { pubsub, db: { CollectionDB }, dbMock }, info){
        console.log("[updateCollection] ");
        const { title, description, state, publishedTime } = data;
        console.log(data);
        // CHANGE to mongo
        /*
        const collection = dbMock.collections.find(collection => collection.id === args.collectionId);
        if(!collection)
            throw new Error("Collection not found!");
            //console.log(collection);
        if(typeof args.data.title == 'string')
            collection.title = args.data.title;
        if(typeof args.data.description == 'string')
            collection.description = args.data.description;
        if(typeof args.data.state == 'number')
            collection.state = args.data.state;
        collection.publishedTime = args.data.publishedTime;
        //console.log(collection);
        return collection
        */
       let updatePayload = {};
       if(title) updatePayload.title = title;
       if(state) updatePayload.state = state;
       if(publishedTime) updatePayload.publishedTime = publishedTime;
       if(description) updatePayload.description = description;
       
       return CollectionDB.findOneAndUpdate(
            { id: collectionId },
            { $set : updatePayload },
            { returnNewDocument : true }
        ).exec().then(result => cleanUp(result)).catch( err => console.log('updateCollection', err));
    },

    deleteBookmark(parent, { id }, { pubsub, dbMock, db:{ BookmarkDB } }, info){
        console.log('[deleteBookmark] ')
        // // Remove from dbMock
        // const bookmark = dbMock.bookmarks.find(bookmark => bookmark.id === args.id);
        // dbMock.bookmarks = dbMock.bookmarks.filter(bookmark => bookmark.id !== args.id);
        // /*
        // pubsub.publish(CHANNELS.DELETE_BOOKMARK, {
        //     deleteBookmarkSub:{
        //         data: bookmark
        //     }
        // })*/
        // return bookmark;
        
        // Remove from MongoDB
        return BookmarkDB.findOneAndDelete({ id: id }).exec().then(bookmark => {
            console.log('deleted bookmark', bookmark)
            return cleanUp(bookmark)
        }).catch(err => console.log('deleteBookmark',err))
        
    },

    async addBookmark(parent, args, { pubsub, dbMock, db: { BookmarkDB }}, info){
        console.log('[addBookmark] ')
        const data = args.data
        const metadata  = await getUrlMetaData(args.data.url);

        if(data.title.trim() === '') delete data['title']
        else delete metadata['title']

        const bookmark = {
            collectionId: args.collectionId,
            id: uuidv4(),
            ...data,
            ...metadata,
        }
        // Add to dbMock
        console.log("meta", metadata);

        // dbMock.bookmarks.push(bookmark);
        const newBookmark = new BookmarkDB(bookmark);
        newBookmark.save(err => err?console.log(err):"added bookmark!");

        /*
        pubsub.publish(CHANNELS.ADD_BOOKMARK, {
            addBookmarkSub: {
                data: bookmark,
            }
        });
        */
        return bookmark;
    },
    async importCollections(parent, { userID, data }, { pubsub, dbMock, db: { CollectionDB, BookmarkDB } }, info){
        console.log('[importCollections] ')

        // // Delete collections, bookmarks related to this user
        // dbMock.collections.map(collection => {
        //     if(collection.authorID === userID)
        //         dbMock.bookmarks = dbMock.bookmarks.filter(bookmark => bookmark.collectionId !== collection.id)
        // })
        // dbMock.collections = dbMock.collections.filter(collection => collection.authorID !== userID )
        
        CollectionDB.find({authorID: userID}).exec().then(async result => {
            await Promise.all(result.map(collection => {
                BookmarkDB.deleteMany({collectionId: collection.id})
                    .exec()
                    .then(result => console.log("deleted bookmarks successfully before import", result))
                    .catch(err => console.log("delete bookmarks failed before import"));
            }))
        }).catch(err => console.log("delete collection before import collection error", err));
        CollectionDB.deleteMany({authorID: userID}).exec()
            .then(result => console.log("Successfully deleted collection before import", result))
            .catch(err => console.log("Fail to delete collection before import"));
        
        const impData = JSON.parse(JSON.stringify(data))

        // var bookmarks = [];
        // // Create new collections
         const importCollections = impData.collections
         await Promise.all(importCollections.map(async importCollection => {
             console.log("modified: ", importCollection.author)
             const { id, title, description, tags, state, publishedTime } = importCollection
             const importBookmarks = importCollection.bookmarks
             console.log(importBookmarks);
             const savedCollection = {
                 id: id,
                 authorID: userID,
                 title: title,
                 description: description,
                 tags: tags,
                 likes: 0,
                 state: state,
                 publishedTime: publishedTime
             }
             //dbMock.collections.push(savedCollection)
             const newCollection = new CollectionDB(savedCollection);
             newCollection.save(err => {
                 err?console.log("Import collection save fail", err):console.log("Import collection success");
             });
            
             await Promise.all(importBookmarks.map(async importBookmark => {
                 const metadata = await getUrlMetaData(importBookmark.url);

                 if(importBookmark.title.trim() === '') delete importBookmark['title']
                 else delete metadata['title']

                 const savedBookmark = {
                     collectionId: id,
                     ...importBookmark,
                     ...metadata
                 }
                 console.log('saved Bookmakr', savedBookmark)
                 //dbMock.bookmarks.push(savedBookmark)
                 const newBookmark = new BookmarkDB(savedBookmark);
                 newBookmark.save(err => {
                     err?console.log("Import collection save bookmark fail", err):console.log("Import collection successfully save bookmark");
                 })
             }))
        }))
    },
    //addCollection(parent, { userID, collectionId, data, bookmarks}, { pubsub, db }, info){
    addCollection(parent, { userID, collectionId, data, bookmarks}, { pubsub, dbMock, db: {BookmarkDB, CollectionDB}}, info){
        let addCollection;
        console.log("Resolver", userID, collectionId, data)
        if(!collectionId || !data){
            console.log("Add an empty collection")
            addCollection = {
                id: uuidv4(),
                authorID: userID,
                title: 'New Collection!',
                description: 'Write some comment about the collection',
                tags: Array(0),
                likes: 0,
                state: COLLECTIONSTATE.PRIVATE,
                publishedTime: null,
            }
            
        }
        else{
            console.log("Add a collection from other")
            console.log(userID, collectionId, data)
            const { title, description, tags, bookmarks} = data.collections
            const newID = uuidv4();
            addCollection = {
                id: newID,
                authorID: userID,
                title: title,
                description: description,
                tags: tags,
                state: COLLECTIONSTATE.FAVORITE,
                likes: 0,
                publishedTime: null
            }
            //Tricky!!!!!!!!
            bookmarks.forEach(bookmark => {
                bookmark.collectionId = newID
                const newUser = new BookmarkDB(bookmark);
                newUser.save(err => {
                    err?console.log("add collection : bookmark", err):console.log("add collection : bookmark success");
                })
                //dbMock.bookmarks.push(bookmark);
            });

        }
        //dbMock.collections.push(addCollection)
        const newCollection = new CollectionDB(addCollection);
        newCollection.save(err => {
            err?console.log("add collection : collection", err):console.log("add collection : collection success");
        })
        console.log(addCollection)
        return "Success";
    },
    deleteCollection(parent, { collectionId }, { pubsub, dbMock, db : { BookmarkDB, CollectionDB }}, info){
        console.log('[deleteCollection] ')
        /*
        const deletedCollection = dbMock.collections.find(collection => collection.id === collectionId)
        console.log("deleted collection", deletedCollection)
        if(!deletedCollection)
            throw new Error('Collection not found!')
        else{
            dbMock.collections = dbMock.collections.filter(collection => collection.id !== collectionId)
        }
        return 'Success'
        */
       BookmarkDB.deleteMany({collectionId: collectionId}).exec()
        .then(result => console.log("deleted bookmarks on delete collection", result)).catch(err=>console.log(err));
        return CollectionDB.findOneAndDelete({id: collectionId}).exec().then(result => {
            if(!result) throw newError("Collection not found!");
            else return 'Success';
        }).catch(err => console.log("delete collection", err));
    }
}

export default Mutation;