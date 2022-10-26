const bcryptjs = require('bcryptjs')
const express = require('express')
const { default: knex } = require('knex')

const routerApi = express.Router()

app.get('', (req, res) => {
    res.status(200).send("Hello World")
})

app.get('/register', (req, res) => {
    let usuario = {
        "nome": req.body.nome,
        "login": req.body.login,
        "email": req.body.email,
        "senha": bcryptjs.hashSync(req.body.senha)
    }
    knex('usuarios')
        .insert(usuario, ['id'])
        .then(usuarios => {
            res.status(201).json({
                "message": "user created",
                "id": usuarios[0].id
            })
        }).catch((err) => {
            res.status(500).json({ "message": "user not create" })
        })
})



app.post('login', (req, res) => {
    knex('usuarios').where('login', req.body.login).andWhere("senha", bcryptjs.hashSync(req.body.senha))
        .then(usuarios => {

        })
        .catch((err) => {})
    res.status(200).send("Hello World")
})