const {Router} = require('express')
const router = Router()
const bookModel = require('../model/book')
const swiperModel = require('../model/swiper')

let swiperCount = 0

async function getCount() { // 获取轮播图的总数
    let allData = await swiperModel.find({status: 1},{_id: 1})
    console.log(allData)
    console.log(allData.length)
    swiperCount = allData.length
    console.log(`swiperTotal:${swiperCount}`)
}

setInterval(getCount, 1000*60)

router.post('/swiper',async (req, res) => { // 插入一张轮播图
    let {title, img, book, index = 1} = req.body

    index = parseInt(index)
    const bookItem = await bookModel.findById(book)
    await swiperModel.create({title, img, book: bookItem._id, index: index})
    swiperCount++
    res.json({
        code: 200,
        msg: '轮播图插入成功'
    })
})

router.get('/swiper', async (req, res) => { // 获取轮播图列表

    let {pn=1,size=10} = req.query
    pn=parseInt(pn)
    size=parseInt(size)

    const data = await swiperModel
        .find({status: 1})
        .sort({index: -1, _id: -1})
        .skip((pn-1)*size)
        .limit(size)
        .populate({path: 'book'})

    res.json({
        code: 200,
        data,
        count: swiperCount
    })
})

router.get('/swiper/:id', async (req, res) => { // 获得某张轮播图
    const {id} = req.params

    const data = await swiperModel
        .findById(id)
        .populate({path: 'book'})

    res.json( {
        code: 200,
        data
    })
})

router.put('/swiper/:id', async (req, res) => { // 修改某张轮播图
    const {id} = req.params
    let {title, img, book, index} = req.body

    index = parseInt(index)
    const bookItem = await bookModel.findById(book) //查找一本书
    if (bookItem) {
        await swiperModel.updateOne({_id: id},{title, img, book: bookItem._id, index})
        res.json({
            code: 200,
            msg: '轮播图修改成功'
        })
    } else {
        res.json({
            code: 400,
            msg: '没有找到对应的图书'
        })
    }
})

router.post('/swiper/delete', async (req, res, next) => { // 删除轮播图
    try {
        const {ids} = req.body
        const deleteData = await swiperModel.updateMany({_id: {$in: ids}}, {$set: {status: 0}})
        swiperCount = swiperCount - deleteData.n
        res.json({
            code: 200,
            msg: `删除成功${deleteData.n}条数据`,
            deleteData
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router
