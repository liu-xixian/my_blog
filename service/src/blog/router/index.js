const express = require('express')
const router = express.Router()
// 插入登录中间件
const login = require('./login.js')
router.use('/', login)


// 插入用户中间件
// const user = require('./userInfo.js')
// router.use('/', user)



module.exports = router