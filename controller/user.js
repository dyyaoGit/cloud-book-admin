const {Router} = require('express')
const router = Router()
const userModel = require('../model/user')
const auth = require('./auth')
const {testPwd} = require('../util/index')
const md5 = require('md5')


router.post('/user', auth, async (req, res) => { // 添加管理员
    let {username, avatar='', desc='', password} = req.body

    if (!avatar) {
        const baseURI = 'http://pbl.yaojunrong.com/avatar'
        avatar = baseURI + Math.floor(Math.random * 9) + '.jpg'
    }

    if (testPwd(password)) {
        password = md5(password)
        await userModel.create({username, avatar, desc, password})
        res.json({
            code: 200,
            msg: '管理员添加成功'
        })
    } else {
        res.json({
            code: 400,
            msg: '密码必须为5位以上'
        })
    }
})

router.put('/user/password', auth, async (req, res) => { // 修改密码
    let {password, new_password} = req.body

    password = md5(password)
    const userInfo = await userModel.findById(req.session.user._id)
    if (userInfo.password === password && testPwd(new_password)) {
        userInfo.set({password: md5(new_password)})
        try {
            await userInfo.save()
            res.json({
                code: 200,
                msg: '修改密码成功'
            })
        }
        catch (err) {
            res.json({
                code: 500,
                msg: '服务器错误，请稍后再试'
            })
        }
    }
})

router.delete('/user', auth, async (req, res) => { // 删除管理员
    const {userIds} = req.body //用户id数组

    const data = await userModel.remove({_id: {$in: userIds}})
    res.json({
        code: 200,
        msg: `成功删除${data.n}名用户`
    })
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const userInfo = await userModel.findOne({username})

    if (userInfo && userInfo.password === md5(password)) {
        req.session.user = userInfo
        res.json({
            code: 200,
            msg: '登录成功'
        })
    } else {
        res.json({
            code: 403,
            msg: '用户名密码不正确'
        })
    }
})



module.exports = router
