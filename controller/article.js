const Router = require('koa-router')
const router = new Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const articleModel = require('../model/articles')
const titleModel = require('../model/titles')
const userModel = require('../model/user')
const readListModel = require('../model/readList')
const ObjectId = mongoose.Types.ObjectId
const {decodeToken} = require('../util/index')
const bookModel = require('../model/book')
// const Towxml = require('../util/towxml/main')
// const towxml = new Towxml()

router.get('/article/:id', async ctx => {
    const {id} = ctx.params
    const token = ctx.request.headers.token
    let userData

    let data = await articleModel.findOne({titleId: id})//查找电子书对应的文章
    const title = await titleModel.findById(data.titleId)//查找电子书对应的所有标题

    try { //登陆状态下
        userData = await decodeToken(token)
        const readData = await readListModel.findOne({
            user: userData.userId,
            book: data.bookId
        })
        console.log('userId', userData.userId)
        console.log('bookId', data.bookId)
        console.log('找到的阅读记录', readData)

        if (readData) {//如果找到了一本看过的书，将标题替换为当前的标题
            console.log('找到源数据', readData)
            await readData.set({title: ObjectId(id)}) //替换为当前标题})
            await readData.save()

        } else {//如果没有找到这本书，那么就是刚刚开始看，去创建一条新的文档记录
            await readListModel.create({
                user: ObjectId(userData.userId),
                book: ObjectId(data.bookId),
                title: ObjectId(id) //替换为当前标题
            })

            await bookModel.update({_id: data.bookId}, {$inc: {looknums: 1}})
        }

        ctx.body = {
            code: 200,
            data: {
                article: data,
                title: title.title
            }
        }

    } catch (err) { //未登录状态下
        console.log('err 未登录')
        console.log(err)
        ctx.body = {
            code: 200,
            data: {
                article: data,
                title: title.title
            }
        }
    }




})

module.exports = router.routes()
