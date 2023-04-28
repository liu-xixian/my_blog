const mysql = require('mysql')

const db = mysql.createPool({
    host:'124.222.195.151',//服务器ip
    port:3306,          
    user:'myblog',  //账户
    password:'Liu19980828',  //密码
    database:'myblog',   //数据库名称

})

module.exports = db