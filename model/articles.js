var mongoose = require("mongoose");

var article = mongoose.Schema({
    content: {
        type: String
    },
    titleId: {
        type: String
    },
    bookId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    },
    index: {
        type: Number
    }
}, {versionKey: false})

module.exports = mongoose.model("article",article);
