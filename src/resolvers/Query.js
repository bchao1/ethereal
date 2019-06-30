import { COLLECTIONSTATE } from './../globalEnum'
import { cleanUp }from '../utils/dbUtils'
const Query = {
    user(parent, { userID } , { dbMock, db: { UserDB } }, info) {
        // return dbMock.users.find(user => user.id === userID);
        return UserDB.findOne({ id: userID }).exec().then(user => {
            console.log('user', user)
            return(cleanUp(user))
        }).catch(err => console.log('user(Query)', err))
    },
    users(parent, { name } , { db: { UserDB }, dbMock }, info) {
        console.log("hello!");
        // return dbMock.users.filter( user => user.name.toLowerCase().includes(name.toLowerCase()) );
        return UserDB.find().exec().then(allUsers => {
            console.log("allUsers", allUsers)
            return allUsers.filter(user => 
                user.name.toLowerCase().includes(name.toLowerCase())
            ).map(user => cleanUp(user))
        }).catch(err => console.log('users(Query)', err))

    },
    collections(parent, { title, collectionId } , { db: { CollectionDB }, dbMock }, info){
        // if(title)
        //     return dbMock.collections.filter(
        //         collection => 
        //         collection.title.toLowerCase().includes(title.toLowerCase()) && 
        //         collection.state === COLLECTIONSTATE.PUBLISHED)
        // else if(collectionId)
        //     return dbMock.collections.filter(
        //         collection =>
        //         collection.id === collectionId
        //     )    
        // return dbMock.collections.filter(
        //     collection => 
        //     collection.state === COLLECTIONSTATE.PUBLISHED)
        
        if(title){
            return CollectionDB.find().exec().then(allCollections => {
                console.log("allCollections", allCollections)
                return allCollections.filter(collection => 
                    collection.title.toLowerCase().includes(title.toLowerCase()) && 
                    collection.state === COLLECTIONSTATE.PUBLISHED    
                ).map(collection => cleanUp(collection))
            }).catch(err => console.log('collections(Query)', err))
        }
        else if(collectionId){
            return CollectionDB.findOne({ id: collectionId }).exec().then(collection => {
                console.log('collection', collection)
                return ([cleanUp(collection)])
            }).catch(err => console.log('collections(Query)', err))
        }
        return CollectionDB.find({ state: COLLECTIONSTATE.PUBLISHED }).exec().then(collections => {
            console.log("collections", collections)
            return collections.map(collection => cleanUp(collection))
        }).catch(err => console.log('collections(Query)', err))
    },
    userCollections(parent, { userID } , { db: { CollectionDB }, dbMock }, info){
        return CollectionDB.find({ authorID: userID }).exec().then(collections => {
            return collections.map(collection => cleanUp(collection))
        }).catch(err => console.log('userCollections(Query)', err))
    }
}

export default Query;