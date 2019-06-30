import CHANNELS from './SubscriptionChannels';

const Subscription = {
    addBookmarkSub:{
        subscribe(parent, args, { dbMock, pubsub }, info){
            return pubsub.asyncIterator(CHANNELS.ADD_BOOKMARK);
        }
    },
    deleteBookmarkSub: {
        subscribe(parent, args, { dbMock, pubsub }, info){
            return pubsub.asyncIterator(CHANNELS.DELETE_BOOKMARK);
        }
    },
    importCollectionSub: {
        subscribe(parent, args, { dbMock, pubsub }, info){
            return pubsub.asyncIterator(CHANNELS.IMPORT_COLLECTION);
        }
    }
}

export default Subscription;