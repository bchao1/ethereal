const mongoose = require('mongoose')
const Schema = mongoose.Schema //資料庫的架構


// 明確定義資料庫中的欄位
const CollectionSchema = new Schema(
    {   
        id: String,
        authorID: String,
        title: String,
        description: String,
        tags: [{
            type: String,
            lowercase: true
        }],
        likes: Number,
        state: Number,
        publishedTime: String,
    }
)

// Creating a table within database with the defined schema
const Collection = mongoose.model('collection', CollectionSchema)

// Exporting table for querying and mutating
module.exports = Collection;
