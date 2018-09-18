var mongoose = require("mongoose")


var book = new mongoose.Schema({
    index: {
        type: Number,
        index: -1,
        default: 1
    },
    title: {
        type: String
    },
    author: {
        type: String
    },
    img: {
        type: String
    },
    desc: {
        type: String
    },
    type: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'category',
        // require: true
    },
    looknums: {
        type: Number,
        default: 0
    },
    startsnums: {
        type: Number,
        default: 0
    },
    like_this_users: [{
        type: mongoose.SchemaTypes.ObjectId
    }],
    status: {
        type: Number,
        default: 1
    }
},{versionKey: false, timestamps: {createdAt: "createTime", updatedAt: 'updateTime'}})


module.exports = mongoose.model("book",book)
