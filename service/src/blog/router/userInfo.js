const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

// 导入 bcryptjs 这个包,用于密码加密
const bcrypt = require('bcryptjs')

// 生成token
const jwt = require('jsonwebtoken')
const config = require('../../../token-config.js')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {updateUserList_scgena,deleteUser_scgena, updateUserInfo_scgena} = require('../scgena/userInfo.js')

// 获取用户列表
router.get('/userList', (req, res) => {
   const data = req.query
   let sqlStr
    if(data.size && data.page){
        sqlStr = `select * from user order by id ${data.sort?data.sort:'asc'} limit ${(data.page -1)*data.size},${data.size} `
    }else{
        sqlStr = `select * from user order by id ${data.sort?data.sort:'asc'}`
    }

    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err,400)
        results.forEach(item => {
            delete item.password
            delete item.token
        })
        sqlStr = 'select count(*) as total from user'
        db.query(sqlStr, (err, total) => {
            if (err) return res.cc(err,400)
            res.send({
                code:200,
                data: results,
                total: total[0].total
            })
        })
      
    })
})

// 根据id修改用户信息
router.post('/updateUserList',expressJoi(updateUserList_scgena), (req, res) => {
    let query = req.body
    const token = req.headers.authorization
    // 解析token
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if(err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if(err) return res.cc(err,400)
            if(results.length !== 1) return res.cc('用户不存在')
            if(results[0].level == 0) return res.cc('无权限修改')
            query.update_time = new Date().getTime();
            sqlStr = 'update user set ? where id=?'
            db.query(sqlStr, [query,query.id], (err, results) => {
                if(err) return res.cc(err,400)
                if(results.affectedRows !== 1) return res.cc('修改失败')
                res.cc('修改成功', 200)
            })
        })
    })   
})

// 根据id删除用户
router.post('/deleteUser',expressJoi(deleteUser_scgena),(req, res) => {
    let query = req.body
    const token = req.headers.authorization
    // 解析token
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if(err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if(err) return res.cc(err,400)
            if(results.length !== 1) return res.cc('用户不存在')
            if(results[0].level == 0) return res.cc('无权限修改')
            sqlStr = 'delete from user where id=?'
            db.query(sqlStr, query.id, (err, results) => {
                if(err) return res.cc(err,400)
                if(results.affectedRows !== 1) return res.cc('删除失败')
                res.cc('删除成功', 200)
            })
        })
    })
})

// 修改自己的个人信息
router.post('/updateUserInfo',expressJoi(updateUserInfo_scgena), (req, res) => {
    let query = req.body
    const token = req.headers.authorization
    // 解析token
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if(err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if(err) return res.cc(err,400)
            if(results.length !== 1) return res.cc('用户不存在')
            if(results[0].level == 0) return res.cc('无权限修改')
            sqlStr = 'update user set ? where id=?'
            query.update_time = new Date().getTime();
            db.query(sqlStr, [query,payload.id], (err, results) => {
                if(err) return res.cc(err,400)
                if(results.affectedRows !== 1) return res.cc('修改失败')
                res.cc('修改成功', 200)
            })
        })
    })   
})

module.exports = router
