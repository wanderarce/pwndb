const bcryptjs = require('bcryptjs')
const express = require('express')
const cors = require('cors')
const routerApi = express.Router()
const jwt = require('jsonwebtoken')

const endpoint = "/"

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});



const checkToken = (req, res, next) => {
    let authHeader = req.get("Authorization")
    if (authHeader && authHeader != undefined) {
        let token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ "message": `Erro ao processar token: ${err.message}` })
            } else {
                req.usuarioId = decodeToken.id
                req.roles = decodeToken.roles
                next()
            }
        })

    } else {
        res.status(401).json({ message: 'Token inválida!' })
    }
}

const isAdmin = (req, res, next) => {
    let roles = req.roles.split(';')
    if (roles.find(elem => elem == 'ADMIN') == 'ADMIN') {
        next()
    } else {
        res.status(403).json({ message: 'Usuário não autorizado' })
    }
}

const produto = (id) => knex.select('*').from('produto')
    .where({ 'id': id })
    .then(produtos => {
        if (produtos.length > 0) {
            res.status(200).json(produtos[0])
        } else {
            res.status(204)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message
        })
    })
routerApi.get('/produtos', checkToken, function(req, res) {
    knex.select('*').from('produto')
        .then(produtos => res.status(200).json(produtos))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar produtos - ' + err.message
            })
        })
})

routerApi.get('produtos/:id', checkToken, function(req, res) {
    let id = req.params.id
    produto(id)
})
routerApi.post('/produtos', checkToken, isAdmin, function(req, res) {
    let produto = {
        'marca': req.body.marca,
        'descricao': req.body.descricao,
        'valor': req.body.valor
    }
    knex('produto').insert(produto, ['id', 'descricao', 'marca', ' valor'])
        .then(produtos => {
            if (produtos.length > 0) {
                res.status(201).json({
                    message: "Produto inserido com sucesso",
                    produto: produtos[0]
                })
            } else {
                res.status(204)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao salvar produtos - ' + err.message
            })
        })
})

routerApi.put('/produtos/:id', checkToken, isAdmin, function(req, res) {

    let produto = {
        'marca': req.body.marca,
        'descricao': req.body.descricao,
        'valor': req.body.valor
    }
    knex('produto').where('id', req.params.id).update(produto, ['id', 'descricao', 'marca', ' valor'])
        .then(produtos => {
            if (produtos.length > 0) {
                res.status(200).json({
                    message: "Produto inserido com sucesso",
                    produto: produtos[0]
                })
            } else {
                res.status(204).send()
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao salvar produtos - ' + err.message
            })
        })
})


routerApi.delete('/produtos/:id', checkToken, isAdmin, function(req, res) {

    let id = req.params.id
    if (id) {
        knex('produto')
            .where('id', id)
            .del().then(result => {
                if (result == 0) {
                    res.status(404).json({ message: "Produto não encontrado" })
                } else {
                    res.status(204).send()
                }
            })
            .catch((err) => {
                res.status(500).json({ message: "Erro ao remover: " + err.message })
            })

    } else {
        res.status(404).json({ message: "Produto não encontrado" })
    }


})

module.exports = routerApi;