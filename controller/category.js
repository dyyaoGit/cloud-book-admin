const {Router} = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const categoryModel = require('../model/category')
const bookModel = require('../model/book')
const auth = require('./auth')
const router = Router()

let categoryCount = 0

async function getCount() {
    let allData = await categoryModel.find({},{_id: 1})
    console.log(allData)
    console.log(allData.length)
    categoryCount = allData.length
    console.log(`total${categoryCount}`)
}

setInterval(getCount, 1000*60)

router.post('/category', auth, async (req, res, next) => { // 添加一条分类
    let {title, icon} = req.body
    try {
        await categoryModel.create({title, icon})

        res.json({
            code: 200,
            msg: '分类插入成功'
        })
    } catch (err) {
        res.json({
            code: 400,
            msg: '缺少必要参数',
            err
        })
    }
})

router.get('/category', async (req, res) => { // 获取分类
    let {pn = 1, size = 10} = req.query
    pn=parseInt(pn)
    size=parseInt(size)

    const data = await categoryModel
        .find()
        .sort({index: -1, _id: -1})
        .limit(size)
        .skip((pn - 1) * size)

    res.json({
        code: 200,
        data,
        count: categoryCount
    })
})

router.get('/category/:id', async (req, res) => { // 获取一条分类
    const {id} = req.params
    let data
    try {
        data = await categoryModel.findById(id)
    } catch (err) {
        throw Error(err)
    }

    res.json({
        code: 200,
        data
    })

})

router.get('/category/books', async (req, res) => { // 根据分类获取图书
    let {pn = 1, size = 2, booksSize = 4} = req.query
    pn = parseInt(pn)
    size = parseInt(size)
    booksSize = parseInt(booksSize)

    const data = await categoryModel.findBookByType({pn, size, booksSize})
    res.json({
        code: 200,
        data
    })

})

router.get('/category/:typeId/books', async (req, res) => { // 获取某分类下的图书
    const {typeId} = req.params
    let {pn = 1, size = 4} = req.query
    pn = parseInt(pn)
    size = parseInt(size)

    const categoryData = await categoryModel.findById(typeId)
    const count = categoryData.books.length
    const data = await categoryModel
        .findById(typeId)
        .populate({
            path: 'books',
            options: {
                limit: size,
                skip: (pn - 1) * size,
                sort: {index: -1, _id: -1}
            }
        })

    res.json({
        code: 200,
        data,
        count
    })

})

router.put('/category/:id', auth, async (req, res) => { // 修改分类
    const {id} = req.params
    let {title, icon, index} = req.body
    index = parseInt(index)
    try {
        await categoryModel.updateOne({_id: id}, {title, icon, index})
        res.json({
            code: 200,
            msg: '分类修改成功'
        })
    } catch (err) {
        res.json({
            code: 400,
            msg: '缺少必要参数',
            err
        })
    }
})

router.delete('/category/:id/book/:bookid' , auth, async (req, res) => { // 删除属于该分类下的图书
    const {id, bookid} = req.params

    try {
        await categoryModel.updateOne({_id: id}, {$pull: {books: ObjectId(bookid)}})
        await bookModel.updateOne({_id: bookid}, {$set: {type: null}}) // 删除书中的分类内容
        res.json({
            code: 200,
            msg: '删除成功'
        })
    } catch(err) {
        res.json({
            code: 400,
            msg: '缺少必要参数',
            err
        })
    }
})

router.post('/category/:id/book/:bookid' , auth, async (req, res) => { // 添加属于该分类下的图书
    const {id, bookid} = req.params

    try {
        if(!id&&!bookid) throw new Error('缺少必要参数')
        await categoryModel.updateOne({_id: id}, {$addToSet: {books: ObjectId(bookid)}}) // 更新该分类
        await bookModel.updateOne({_id: bookid}, {$set: {type: ObjectId(id)}}) // 更新相应的数的分类内容为该图书

        res.json({
            code: 200,
            msg: '添加成功'
        })
    } catch(err) {
        res.json({
            code: 400,
            msg: '缺少必要参数',
            err
        })
    }
})

router.delete('/category/:id', async (req, res) => { // 删除一个分类
    const {id} = req.params

    if(id){
        const categoryItem =  await categoryModel.findById(id)
        if(categoryItem.books&&categoryItem.books.length == 0){
            const removeData = await categoryItem.remove()
            await categoryItem.save()
            console.log(removeData)
            res.json({
                code: 200,
                msg: `成功删除${1}个分类`,
                deleteData: removeData
            })
        } else {
            res.json({
                code: 200,
                msg: '该分类下存在图书'
            })
        }
    } else {
        res.json({
            code: 400,
            msg: '缺少必要参数'
        })
    }
})

module.exports = router
