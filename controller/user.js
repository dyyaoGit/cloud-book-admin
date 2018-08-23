const {Router} = require('express')
const router = Router()
const userModel = require('../model/user')
const auth = require('./auth')
const {testPwd} = require('../util/index')
const md5 = require('md5')


router.post('/user', auth, async (req, res) => { // 添加管理员
    let {username, avatar = '', desc = '', password, email} = req.body

    if (!avatar) {
        const baseURI = 'http://pbl.yaojunrong.com/avatar'
        avatar = baseURI + Math.floor(Math.random * 9) + '.jpg'
    }

    if (testPwd(password)) {
        password = md5(password)
        await userModel.create({username, avatar, desc, password, email})
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
    } else {
        res.json({
            code: 400,
            msg: '原密码错误'
        })
    }
})

router.put('user/userInfo', auth, async (req, res) => { // 修改个人信息
    let { username, avatar, desc, email} = req.body

    const userInfo = await userModel.findById(req.session.user._id)
    userInfo.set({username, avatar, desc, email})
    try {
        const handleData = await userInfo.save()
        res.json({
            code: 200,
            msg: '修改个人信息成功'
        })
    } catch (err) {
        res.json({
            code: 500,
            msg: '修改失败，请稍后重试'
        })
    }
})

router.post('/user/delete', auth, async (req, res) => { // 删除管理员
    const {userIds} = req.body //用户id数组

    console.log(userIds)
    const data = await userModel.remove({_id: {$in: userIds}})
    res.json({
        code: 200,
        msg: `成功删除${data.n}名用户`
    })
})

router.get('/user', auth, async (req, res) => { // 获取管理员
    const userId = req.session.user._id
    const data = await userModel.find({_id: {$ne: userId}}, {password: 0})
    res.json({
        code: 200,
        data
    })
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const userInfo = await userModel.findOne({username})

    if (userInfo && userInfo.password === md5(password)) {
        req.session.user = userInfo
        res.json({
            code: 200,
            msg: '登录成功',
            data: {
                username: userInfo.username,
                email: userInfo.email,
                avatar: userInfo.avatar,
                desc: userInfo.desc
            }
        })
    } else {
        res.json({
            code: 403,
            msg: '用户名密码不正确'
        })
    }
})

router.get('/logout', (req, res) => {

    if (req.session.user) {
       req.session.user = null
        res.json({
            code: 200,
            msg: '退出登陆成功'
        })
    } else {
        res.json({
            code: 400,
            msg: '未登录状态'
        })
    }

})

module.exports = router
