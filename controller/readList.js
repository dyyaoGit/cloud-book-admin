const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const readListModel = require('../model/readList')
const {decodeToken} = require('../util/index')
const router = new Router()


router.get('/readList', async (ctx, next) => {
    const {pn=1, size=10} = ctx.request.query
    const token = ctx.request.headers.token||''
    let userData


    console.log('readlist得到的token', token)
    try {
        userData = await decodeToken(token)
    } catch (err) {
        console.log(err)
        ctx.body = {
            code: 401,
            msg: '登陆状态失效,请重新登陆'
        }
        return
    }

    let readHistory = await readListModel
        .find({user: ObjectId(userData.userId)})
        .populate({path: 'book'})
        .populate({path: 'title'})
        .sort({_id:-1})
        .skip((pn-1)*(size-0))
        .limit((size-0))

    ctx.body = {
        code: 200,
        data: readHistory
    }

})

module.exports = router.routes()
