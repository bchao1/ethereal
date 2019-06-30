const mongoose = require('mongoose')
const Schema = mongoose.Schema //資料庫的架構


// 明確定義資料庫中的欄位
const BookmarkSchema = new Schema(
    {   
        id: String,
        collectionId: String,
        title: String,
        description: String,
        url: String,
        shortUrl: String,
        icon: String,
    }
)

// Creating a table within database with the defined schema
const Bookmark = mongoose.model('bookmark', BookmarkSchema)

// Exporting table for querying and mutating
module.exports = Bookmark;
