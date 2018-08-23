const {Router} = require('express')
const router = Router()
const bookModel = require('../model/book')
const swiperModel = require('../model/swiper')

router.post('/swiper',async (req, res) => { // 插入一张轮播图
    const {title, img, book, sort=100, index = 1} = req.body

    const bookItem = await bookModel.findById(book)
    await swiperModel.create({title, img, book: bookItem._id,sort, index: 1})
    ctx.body = {
        code: 200,
        msg: '轮播图插入成功'
    }

})

router.get('/swiper', async (req, res) => { // 获取轮播图列表

    let {pn=1,size=10} = ctx.request.query
    pn=parseInt(pn)
    size=parseInt(size)

    const data = await swiperModel
        .find()
        .sort({index: -1, _id: -1})
        .skip((pn-1)*size)
        .limit(size)
        .populate({path: 'book'})

    ctx.body = {
        code: 200,
        data
    }
})

router.get('/swiper/:id', async (ctx, next) => {
    const {id} = ctx.params

    const data = await swiperModel
        .findById(id)
        .populate({path: 'book'})

    ctx.body = {
        code: 200,
        data
    }
})


module.exports = router
