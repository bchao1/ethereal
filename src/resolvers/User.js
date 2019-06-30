import { COLLECTIONSTATE } from './../globalEnum'
import { cleanUp } from '../utils/dbUtils';
const User = {
    following(parent, args, {dbMock, db: { UserDB }}, info){
        //const followingIDs = dbMock.users.find(user => user.id === parent.id).following;
        //return followingIDs.map(userID => dbMock.users.find(user => user.id === userID));
        /*return UserDB.findOne({id: parent.id}).exec().then(result => {
            const followingIDs = result.following;
            return followingIDs.map(id => UserDB.find({id: id}).exec().then(result => {
                return cleanUp(result);
            }).catch(err=>console.log(err)));
        }).catch(err=>console.log(err));
        */
       return [];
    },
    collections(parent, { queryPublished }, { dbMock, db : { CollectionDB } }, info){
        if(!queryPublished){
            //return dbMock.collections.filter(collection => collection.authorID === parent.id);
            return CollectionDB.find({authorID: parent.id}).exec().then(result => {
                return result.map(item => cleanUp(item));
            }).catch(err=>console.log(err));
        }
        else
            /*
            return dbMock.collections.filter(collection => {
                return ( collection.authorID === parent.id && collection.state === COLLECTIONSTATE.PUBLISHED )
            });
            */
           return CollectionDB.find({authorID: parent.id, state: COLLECTIONSTATE.PUBLISHED})
                    .then(result => result.map(item => cleanUp(item))).catch(err => console.log(err));
    },
    followers(parent, args, {dbMock, db : {USERDB}}, info){
        //const followersIDs = dbMock.users.find(user => user.id === parent.id).followers;
        //return followersIDs.map(userID => dbMock.users.find(user => user.id === userID));
        return []
    }
}

export default User;