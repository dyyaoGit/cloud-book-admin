var mongoose = require("mongoose");

var titles = new mongoose.Schema({
    title: {
        type: String
    },
    bookId: {
        type: String
    },
    index: {
        type: Number
    },
    total: {
        type: Number
    }
},{versionKey: false})

module.exports = mongoose.model("titles",titles)
