const mongoose = require("mongoose")

const adminUser = new mongoose.Schema({
    username: {
        index: true,
        type: String
    },
    nickname: {
        type: String,
        require: true,
        index: true
    },
    avatar: String,
    desc: {
        type: String,
        default: '我的后台系统我做主'
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String
    }
},{versionKey: false, timestamps: {createdAt: 'createdTime', updatedAt: 'updatedTime'}})

module.exports = mongoose.model("adminUser",adminUser)
