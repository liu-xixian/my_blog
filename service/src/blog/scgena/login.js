const joi = require('joi')
const id = joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
const phone = joi.string().regex(/^1[3-9]\\d{9}$/)
const email = joi.string().email()
const password = joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).required()
const account = joi.string().regex(/^[a-zA-Z0-9]{3,16}$/).required()
const user_nick = joi.string().regex(/^[a-zA-Z0-9]{6,16}$/)
const image = joi.string()
const state = joi.number().integer().min(0).max(1)
const level = joi.number().integer().min(0).max(1)

exports.login_scgena = {
    body: {
        account,
        password,
    }
}
exports.register_scgena = {
    body: {
        account,
        password,
        user_nick,
        image,
    }
}