const mongoose = require('mongoose')
const Schema = mongoose.Schema //資料庫的架構
const validator = require('validator');


// 明確定義資料庫中的欄位
const UserSchema = new Schema(
    {   
        id: String,
        name: String,
        password: String,
        email:{
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: (value) => {
                return validator.isEmail(value)
            }
        },
        avatar: String,
        followers: [{
            type: String
        }],
        following: [{
            type: String,
        }],
    }
)

// Creating a table within database with the defined schema
const User = mongoose.model('user', UserSchema)

// Exporting table for querying and mutating
module.exports = User;
