const express = require('express');
const app = express();
// joi是一个验证包
const joi = require('joi')

// 配置cors跨域
const cors = require('cors');
app.use(cors());

// 解析表单数据的中间件 
app.use(express.urlencoded({extended:false}))


// 在路由之前封装res.cc 函数
app.use((req,res,next) => {
    // status默认为1,err的值可能是个错误对象，也可能是一个描述字符串
    res.cc = function (err,code=403){
        res.send({
            code,
            error:err instanceof Error ? err.message : err
        })
    }
    res.dd = function (data,code=200,message='成功'){{
        res.send({
            code,
            data,
            message
        })
    }
    }
    next()
})

app.use(express.static(__dirname))
// 在路由之前解析token
const expressJWT = require('express-jwt');
const config = require('./token-config.js');
app.use(expressJWT({secret:config.jwSecretKen}).unless({path:[/^\/blog\/login/,/^\/blog\/register/,/^\/blog\/get/]}));
console.log(config);
// 导入blog路由
const blog = require('./src/blog/router/index.js');
app.use('/blog', blog);


// // 定义错误级别中间件
app.use((err,req,res,text) => {
    if(err instanceof joi.ValidationError) return res.cc(err,400)
    if(err.name === 'UnauthorizedError') return res.cc('token认证失败!',401)
    res.cc(err,400)
})


// 启动服务器
app.listen(3000, () => {
    console.log('服务器启动成功: http://127.0.0.1:3000');
});
