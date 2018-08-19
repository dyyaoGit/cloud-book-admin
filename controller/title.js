const titleModel = require('../model/titles')
const Router = require('koa-router')
const router = new Router()
const auth = require('./auth')
const {decodeToken} = require('../util/index')

router.get('/titles/:id', async (ctx, next) => {
    const {id} = ctx.params

    const titles = await titleModel
        .find({bookId: id})
        .sort({index: 1})

    ctx.body = {
        code: 200,
        data: titles
    }
})

module.exports = router.routes()
