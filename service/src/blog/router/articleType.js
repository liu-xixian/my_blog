const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

// 生成token
const jwt = require('jsonwebtoken')
const config = require('../../../token-config.js')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {addArticleType_scgena, updateArticleType_scgena, deleteArticleType_scgena} = require('../scgena/articleType.js')


router.post('/add/articleType',expressJoi(addArticleType_scgena), (req, res) => {
    let query = req.body
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            // 判断是否已经存在相同的alias
            sqlStr = 'select * from article_type where alias=?'
            db.query(sqlStr, query.alias, (err, results) => {
                if (err) return res.cc(err,400)
                if (results.length !== 0) return res.cc('已经存在,请重新输入')
                query.caeate_time = new Date().getTime();
                // 添加
            let sqlStr = 'insert into article_type set ?'
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

  
})

// 获取文章类型
router.get('/get/articleType', (req, res) => {
    let query = req.query
    // 分页并且倒叙
    if(data.size && data.page){
        sqlStr = `select * from article_type order by id ${data.sort?data.sort:'asc'} limit ${(data.page -1)*data.size},${data.size} `
    }else{
        sqlStr = `select * from article_type order by id ${data.sort?data.sort:'asc'}`
    }
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err,400)
        sqlStr = 'select count(*) as total from article_type'
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

// 修改文章类型
router.post('/update/articleType',expressJoi(updateArticleType_scgena), (req, res) => {  
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
                let sqlStr = 'update article_type set ? where id=?'
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

// 删除文章类型
router.post('/delete/articleType',expressJoi(deleteArticleType_scgena),(req, res) => {
    let query = req.body
    let token = req.headers.authorization
    jwt.verify(token.split(' ')[1], config.jwSecretKen, (err, payload) => {
        if (err) return res.cc(err,400)
        let sqlStr = 'select * from user where id=?'
        db.query(sqlStr, payload.id, (err, results) => {
            if (err) return res.cc(err,400)
            if (results.length !== 1) return res.cc('用户不存在')
            if (results[0].level == 0) return res.cc('无权限修改')
            // 删除
            let sqlStr = 'delete from article_type where id=?'
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




module.exports = router