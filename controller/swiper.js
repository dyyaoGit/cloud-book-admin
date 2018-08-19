const Router = require('koa-router')
const router = new Router()
const bookModel = require('../model/book')
const swiperModel = require('../model/swiper')

router.post('/swiper',async (ctx, next) => {
    const {title, img, book, sort=100, index = 1} = ctx.request.body

    const bookItem = await bookModel.findById(book)
    await swiperModel.create({title, img, book: bookItem._id,sort, index: 1})
    ctx.body = {
        code: 200,
        msg: '轮播图插入成功'
    }

})

router.get('/swiper', async (ctx, next) => {

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


module.exports = router.routes()
