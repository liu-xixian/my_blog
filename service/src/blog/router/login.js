const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

// 导入 bcryptjs 这个包,用于密码加密
const bcrypt = require('bcryptjs')

// 生成token
const jwt = require('jsonwebtoken')
const config = require('../../../token-config.js')
// 登录
router.post('/login', (req, res) => {
    let query = req.query
    const sqlStr = 'select * from user where account=?'
    db.query(sqlStr,query.account,(err,results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('账号不存在')
        const compareResult = bcrypt.compareSync(query.password,results[0].password)
        if(!compareResult) return res.cc('密码错误')
        
        // 生成token
        let user = {account:results[0].account,id:results[0].id,user_pic:''}
        const tokenStr = jwt.sign(user,config.jwSecretKen,{expiresIn:config.expiresIn})
        // token 写入数据库
        const sqlStr = 'update user set token=? where id=?'
        db.query(sqlStr,[tokenStr,results[0].id],(err,results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('登录失败')
            res.dd({
                token:tokenStr
            })
        }
        )
    })
})

// 注册接口
router.post('/register', (req, res) => {
    let query = req.query
    const sqlStr = 'select * from `user` where account=?'

    db.query(sqlStr,query.account,(err,results) => {
        console.log(err,results);
        if(err) return res.cc(err)
        if(results.length > 0) return res.cc('账号已存在')
        query.password = require('bcryptjs').hashSync(query.password,10)
        query.image = query.image?query.image:'http://www.liuxixian.com/wp-content/uploads/2023/01/srchttp___c-ssl.duitang.com_uploads_blog_202107_24_20210724123707_3b82e.thumb_.1000_0.jpgreferhttp___c-ssl.duitang-2.webp'
        query.user_nick = query.user_nick?query.user_nick:'小可爱'
        const sqlStr = 'insert into `user` set ?'
        db.query(sqlStr,query,(err,results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('注册失败')
            res.cc('注册成功',200)
        })
    })
})

// 获取用户信息
router.get('/userInfo', (req, res) => {
    res.send('获取用户信息接口')
})

module.exports = router