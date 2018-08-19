const mongoose = require("mongoose")

const readlist = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    book: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    },
    title: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'titles'
    }
},{versionKey: false, timestamps: {createdAt: 'createdTime', updatedAt: 'updatedTime'}})

module.exports = mongoose.model("readlist",readlist)

