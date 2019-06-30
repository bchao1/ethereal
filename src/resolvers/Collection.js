import { cleanUp } from '../utils/dbUtils';

const Collection = {
    author(parent, args, { dbMock, db : { UserDB } }, info){
        //return dbMock.users.find(user => user.id === parent.authorID);
        return UserDB.findOne({id: parent.authorID}).exec().then(content => {
            return cleanUp(content);
        }).catch(err => console.log(err));
    },
    bookmarks(parent, args, { dbMock, db : { BookmarkDB } }, info){
        //return dbMock.bookmarks.filter(bookmark => bookmark.collectionId === parent.id);
        return BookmarkDB.find({collectionId: parent.id}).exec().then(result => {
            return result.map(item => cleanUp(item));
        }).catch(err => console.log(err));
    }
}

export default Collection;