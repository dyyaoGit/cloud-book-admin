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
        index: -1,   //轮播图排序
        default: 1,
        type: Number
    },
    img: {              //图片地址
        type: String
    },
    index: {      // 轮播图排序
        index: -1,
        type: Number
    },
    status: { // 是否搜索该轮播图
        type: Number,
        default: 1
    }
},{versionKey: false, timestamp: {createdAt: "createTime", updatedAt: 'updateTime'}})


module.exports = mongoose.model('swiper', swiperSchema)
