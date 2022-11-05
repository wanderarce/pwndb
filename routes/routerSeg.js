const bcryptjs = require('bcryptjs')
const express = require('express')
const cors = require('cors')
const routerSeg = express.Router()
const jwt = require('jsonwebtoken')


const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});




routerSeg.post('/register', (req, res) => {
    let pass = bcryptjs.hashSync(req.body.senha, 8)

    knex('usuario')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: pass,
            email: req.body.email
        }, ['id'])
        .then((result) => {
            console.log(result)
            let usuario = result[0]
            if (usuario) {
                res.status(201).json({
                    message: "Usuário criado com sucesso"
                })
            } else {
                res.status(201).json({ message: "Erro ao tentar criar usuário" })
            }
            return
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
})


routerSeg.post('/login', (req, res) => {
    knex
        .select('*').from('usuario').where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcryptjs.compareSync(req.body.senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.id, roles: usuario.roles },
                        process.env.SECRET_KEY, {
                            expiresIn: 3600
                        })

                    res.status(200).json({
                        id: usuario.id,
                        login: usuario.login,
                        nome: usuario.nome,
                        roles: usuario.roles,
                        token: tokenJWT
                    })
                    return
                } else {
                    res.status(401).json({ message: 'Login ou senha incorretos' })
                }
            } else {

                res.status(401).json({ message: 'Login ou senha incorretos' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: `Erro ao verificar login: ${err.message}` })
        })
})

module.exports = routerSeg;