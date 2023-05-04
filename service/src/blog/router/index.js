const express = require('express')
const router = express.Router()
// 插入登录中间件
const login = require('./login.js')
router.use('/', login)


// 插入用户中间件
const user = require('./userInfo.js')
router.use('/', user)

// 插入处理文章分类中间件
const articleType = require('./articleType.js')
router.use('/', articleType)

// 插入处理文章中间件
const article = require('./article.js')
router.use('/', article)

module.exports = router