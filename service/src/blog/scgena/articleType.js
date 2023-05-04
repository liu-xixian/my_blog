const joi = require('joi')
const id = joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
const name = joi.string().required()
const alias = joi.string().required()

exports.addArticleType_scgena = {
    body: {
        name,
        alias,
    }
}

exports.updateArticleType_scgena = {
    body: {
        id,
        alias,
    }
}

exports.deleteArticleType_scgena = {
    body: {
        id,
    }
}