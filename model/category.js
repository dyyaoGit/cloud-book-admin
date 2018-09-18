const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    index: {
        type: Number,
        index: -1,
        default: 1
    },
    title: {
        type: String,
        unique: true
    },
    icon: {
        type: String,
        require: true
    },
    books: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'book'
        }
    ],
    status: {
        type: Number,
        default: 1
    }
},{versionKey: false, timestamp: {createdAt: "createTime", updatedAt: 'updateTime'}})

categorySchema.statics.findBookByType = function (options,cb) {
    options = options || {booksSize: 4, pn: 1, size: 2}
    const {booksSize, pn, size} = options
    console.log(options)

    return this.find()
        .skip((pn-1)*size)
        .limit(size)
        .sort({index: -1, _id: -1})
        .populate({path: 'books', options: {limit: booksSize, sort: {index: -1, _id: -1}}})
        .exec(cb)
}

module.exports = mongoose.model("category",categorySchema)
