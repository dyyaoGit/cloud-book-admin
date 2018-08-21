const book = require('../model/book')
const titleModel = require('../model/titles')
const category = require('../model/category')
const article = require('../model/articles')
const collectionModel = require('../model/bookCollection')
const request = require("request")
const rq = require("request-promise")
const cheerio = require("cheerio")
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

exports.addBook = async (req, res) => {
    let {url,author,img,typeId} = req.body
    console.log({ url, author, img})

    const body = await rq(url)  //爬取文章首页
    const $ = cheerio.load(body)
    let name = $("title").text();
    let desc = $("[name=description]").attr("content");
    const type = await category.findById(typeId)  //获取分类

    const bookData = await book.create({title: name, desc,author,img,type: type._id}) //创建一个图书

    await type.update({$push: {books: bookData._id}}) //创建图书后更新分类列表中的图书
    // console.log($(".catalog a"))

    const total = $(".catalog a").length

    $(".catalog a")     //读取到所有的标题数组
        .each(async function(index) {
            index = parseInt(index)
            var title = $(this).text();
            var num = $(this).attr("href");
            var getUrl = url.split("/");
            getUrl.pop();
            getUrl = getUrl.join("/");
            var trueUrl = getUrl+"/"+num;
            const t = await titleModel.create({
                title,
                bookId: bookData._id,
                index: index,
                total
            })
            const backData = await rq(trueUrl)
            const $Query = cheerio.load(backData);
            const content = $Query(".content").text().trim();
            // console.log(content)
            await article.create({content: content, titleId: t._id, bookId: ObjectId(t.bookId), index: t.index})
        })

    res.json({
        code: 200,
        msg: '收到'
    })
}


exports.getBook = async (req,res) => {
    const {pn, size} = req.query

    const data = await book.find()
        .populate({path: 'type'})
        .sort({index: -1, _id:-1})
        .limit(size)
        .skip((pn-1)*size)

    res.json({
        code: 200,
        data
    })
}

exports.getBookById = async (req, res) => { // 获取一本图书
    const bookId = req.params.id
    let bookData
    console.log(req.params)

    try {
        bookData = await book.findById(bookId)
    } catch(err) {
        throw Error(err)
    }
    res.json({
        code: 200,
        data: bookData
    })
}

exports.changeBook = async (req,res) => {
    let {book_id, index, title, author, img, desc, type} = req.body

    index = parseInt(index)
    const bookData = await book.findById(book_id) // 找到一本书的实例
    await category.updateOne({_id: bookData.type}, {$pull: {books: bookData._id}}) // 删除原来分类当中的书
    await category.updateOne({_id: type}, {$push: {books: bookData._id}}) // 添加到新分类的书当中
    bookData.set({index, title, author, img, desc, type: ObjectId(type)}) // 更新书的内容
    await bookData.save() // 存储更新的书籍

    res.json({
        code: 200,
        msg: '书籍更新成功'
    })
}


