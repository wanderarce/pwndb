const express = require('express')
const morgan = require('morgan')
const app = express()
const routerApi = require('./routes/routerApi')

const pessoas = []

const pessoa = {
    "id": 1,
    "nome": "Warce"
}

pessoas.push(pessoa)

app.use(morgam('common'))

app.use('/site', express.static('site'))
app.use("/api", routeApi)
app.use(express.json())