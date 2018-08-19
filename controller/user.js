const Router = require('koa-router')
const router = new Router()
const axios = require('axios')
const { wxApi, secret,authType, decodeToken } = require('../util/index')
const userModel = require('../model/user')

const jwt = require('jsonwebtoken')



router.post('/login', async (ctx, next) => {
    let userCode = ctx.request.body.code //获取客户端code
    let {
        appid='wx046d05ad6eaa75a7',
        secret='fdf84cdb1e98c0682a6b678e89ffbe30'
    } = ctx.request.body // 获取应用的appid和secret


    // let params = {
    //     appid: 'wx046d05ad6eaa75a7',
    //     secret: 'fdf84cdb1e98c0682a6b678e89ffbe30',
    //     js_code: userCode,
    //     grant_type: 'authorization_code'
    // }//生成请求参数
    let params = {
        appid,
        secret,
        js_code: userCode,
        grant_type: 'authorization_code'
    }//生成请求参数

    console.log('appid信息', params)
    const data = await axios.get(wxApi.getOpenId,{params}) //请求腾讯服务器获取open_id和session_key
    console.log('code信息',data.data)
    if (data.data.errcode) {
        console.log(data.data)
        ctx.body = {
            code: 401,
            msg: '登录失败,无效的code'
        }
        return
    }

    let user = await userModel.findOne({
        open_id: data.data.openid
    }) //查找数据库是否有当前用户
    if (!user) {
        user = await userModel.create({ //如果没有就创建一个用户
            open_id: data.data.openid,
            session_key: data.data.session_key
        })
    }
    const tokenData = {
        opend_id: data.data.openid,
        userId: user._id
    }
    const token = jwt.sign(tokenData, 'dyyao', authType)
    ctx.set('token', token) //将签名设置到请求头当中
    ctx.body = {
        code: 200,
        msg: '登录成功'
    }
    await next()
})

router.get('/user', async (ctx, next) => {
    let {token} = ctx.request.header || ''
    let userData

    try {  // 解密token
        userData = decodeToken(token)
    } catch (err) {
        ctx.body = {
            code: 401,
            msg: err
        }
        throw Error(err)
    }
    let user = await userModel.findById(userData.userId, {open_id: 0})
    console.log(userData)
    if (!user) {
        ctx.body = {
            code: 403,
            msg: '用户不存在'
        }
        return
    }

    ctx.body = {
        code: 200,
        // msg:
        data: user
    }
})


module.exports = router.routes()
