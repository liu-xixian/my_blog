const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

// 生成token
const jwt = require('jsonwebtoken')
const config = require('../../../token-config.js')


// 增加文章
router.post('/add/article', (req, res) => {
    let query = req.body
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            query.caeate_time = new Date().getTime();
            // 添加
            let sqlStr = 'insert into article set ?'
            db.query(sqlStr, query, (err, results) => {
                if (err) return res.cc(err,400)
                res.send({
                    code: 200,
                    msg: '添加成功'
                })
            })
        })
    })
})

// 修改文章
router.post('/update/article', (req, res) => {
    let query = req.body
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            query.update_time = new Date().getTime();
            // 修改
            let sqlStr = 'update article set ? where id=?'
            db.query(sqlStr, [query, query.id], (err, results) => {
                if (err) return res.cc(err,400)
                res.send({
                    code: 200,
                    msg: '修改成功'
                })
            })
        })

    })
})
// 获取文章列表
router.get('/get/article', (req, res) => {
    let data = req.body
    let keyArr= []
    for(let key in data){
        if(key === 'query'){
           keyArr.push(`(title like '%${data.query}%' or content like '%${data.query}%')`)
        }else if(key === 'label'){
            keyArr.push(`label like '%${data.label}%'`)
        }else if(key === 'type'){
            keyArr.push(`type=${data.type}`)
        }else if(key === 'state'){
            keyArr.push(`state=${data.state}`)
        }
    }
    let where = keyArr.length?'where '+keyArr.join(' and '):'';
    // 分页并且倒叙
    if(data.size && data.page){
        sqlStr = `select * from article ${where} order by id ${data.sort?data.sort:'asc'} limit ${(data.page -1)*data.size},${data.size} `
    }else{
        sqlStr = `select * from article ${where}  order by id ${data.sort?data.sort:'asc'}`
    }
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err,400)
        // 删除文章内容字段
        results.forEach(item => {
            delete item.content
        })
        // 查询总条数
        let sqlStrTotal = `select count(*) as total from article ${where}`
        db.query(sqlStrTotal, (err, resultsTotal) => {
            if (err) return res.cc(err,400)
        res.send({
            code: 200,
            msg: '获取成功',
            data: results,
            total: resultsTotal[0].total
        })
        })
    })
})

// 删除文章
router.post('/delete/article', (req, res) => {
    let query = req.query
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            let sqlStr = 'delete from article where id=?'
            db.query(sqlStr, query.id, (err, results) => {
                if (err) return res.cc(err,400)
                if(results.affectedRows !== 1) return res.cc('删除失败')
                res.send({
                    code: 200,
                    msg: '删除成功'
                })
            })
        })
    })
})


// 获取文章详情
router.post('/get/article/detail', (req, res) => {
    let query = req.query
    let sqlStr = 'select * from article where id=?'
    db.query(sqlStr, query.id, (err, results) => {
        if (err) return res.cc(err,400)
        res.send({
            code: 200,
            msg: '获取成功',
            data: results[0]
        })
    })
})


// 增加文章评论
router.post('/add/comment', (req, res) => {
    let query = req.body
    query.caeate_time = new Date().getTime();
    // 根据article_id查询是否有该文章
    let sqlStr = 'select * from article where id=?'
    db.query(sqlStr, query.article_id, (err, results) => {
        if (err) return res.cc(err,400)
        if (results.length !== 1) return res.cc('文章不存在')
        // 添加
        let sqlStr = 'insert into comment set ?'
        db.query(sqlStr, query, (err, results) => {
            if (err) return res.cc(err,400)
            res.send({
                code: 200,
                msg: '添加成功'
            })
        })
    })
})

// 修改文章评论
router.post('/update/comment', (req, res) => {
    let query = req.body
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            // 修改
            let sqlStr = 'update comment set ? where id=?'
            db.query(sqlStr, [query, query.id], (err, results) => {
                if (err) return res.cc(err,400)
                res.send({
                    code: 200,
                    msg: '修改成功'
                })
            })
        })
    })
})

// 删除评论
router.post('/delete/comment', (req, res) => {
    let query = req.query
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            let sqlStr = 'delete from comment where id=?'
            db.query(sqlStr, query.id, (err, results) => {
                if (err) return res.cc(err,400)
                if(results.affectedRows !== 1) return res.cc('删除失败')
                res.send({
                    code: 200,
                    msg: '删除成功'
                })
            })
        })
    })
})

// 根据文章id获取评论
router.get('/get/comment', (req, res) => {
    let query = req.query
    let sqlStr
    // 分页
    if(query.size && query.page){
        sqlStr = `select * from comment where article_id=? order by create_time ${query.sort?query.sort:'desc'} limit ${(query.page -1)*query.size},${query.size} `
    }
    db.query(sqlStr, query.id, (err, results) => {
        if (err) return res.cc(err,400)
        // 查询总条数
        let sqlStrTotal = `select count(*) as total from comment where article_id=?`
        db.query(sqlStrTotal, query.id, (err, resultsTotal) => {
            if (err) return res.cc(err,400)

        res.send({
            code: 200,
            msg: '获取成功',
            data: results,
            total: resultsTotal[0].total
        })
        })
    })
})  




module.exports = router
