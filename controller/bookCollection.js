const Router = require('koa-router')
const router = new Router()
const collectionModel = require('../model/bookCollection')
const {decodeToken} = require('../util/index')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

router.post('/collection', async (ctx, next) => {
    let token = ctx.request.headers.token
    let {bookId} = ctx.request.body
    let data
    try {
        data = await decodeToken(token)
        console.log(data.userId)
        const book = await collectionModel.findOne(
                {
                    user: ObjectId(data.userId),
                    book: ObjectId(bookId)
                })
        if(book){
            ctx.body = {
                code: 400,
                msg: '图书不能重复添加'
            }
        } else {
            await collectionModel.create({user: ObjectId(data.userId), book: ObjectId(bookId)})

            ctx.body = {
                code: 200,
                msg: '添加收藏成功'
            }
        }
        await next()
    } catch(err) {
        ctx.body = {
            code: 401,
            msg: '登陆状态过期，请重新登陆'
        }
    }
})

router.get('/collection', async (ctx, next) => {
    const token = ctx.request.headers.token
    const {pn=1, size=10} = ctx.request.query
    try{
        const tokenData = await decodeToken(token)
        const data = await collectionModel
            .find({user: ObjectId(tokenData.userId)})
            .populate({path: 'book'})
            .skip((pn-1)*(size-0))
            .limit(size-0)
            .sort({_id: -1})
        ctx.body = {
            code: 200,
            data
        }
    } catch (err) {
        ctx.body = {
            code: 401,
            msg: '登陆状态失效，请重新登陆'
        }
    }
})

router.delete('/collection/:id', async (ctx, next) => {
    const token = ctx.request.headers.token
    const {id} = ctx.params
    let tokenData

    try {
        tokenData = await decodeToken(token)
    } catch(err) {
        ctx.body = {
            code: 401,
            msg: '登录状态失效，请重新登录'
        }
        return
    }

    try {
        const data = await collectionModel.remove({user: ObjectId(tokenData.userId), book: ObjectId(id)})
        if (data.n == 1) {
            ctx.body = {
                code: 200,
                msg: '删除收藏成功'
            }
        } else {
            ctx.body = {
                code: 400,
                msg: '不存在该收藏'
            }
        }

    } catch (err) {
        ctx.body = {
            code: 500,
            msg: '服务器繁忙，请稍后再试'
        }
    }
})

module.exports = router.routes()
