const mongoose = require('mongoose')

const swiperSchema = mongoose.Schema({
    title: {
        type: String     //轮播图标题
    },
    book: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    },
    sort: {
        type: Number,   //轮播图排序
        default: 100
    },
    img: {              //图片地址
        type: String
    }
},{versionKey: false, timestamp: {createdAt: "createTime", updatedAt: 'updateTime'}})


module.exports = mongoose.model('swiper', swiperSchema)
