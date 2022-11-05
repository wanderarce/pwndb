const cors = require('cors')
const express = require('express')
const routerClient = express.Router()
routerClient.use('/site', express.static('./site'))

routerClient.use("/templates/:pag", (req, res) => {
    let pag = req.params.pag;
    res.render('index', {
        'nome': 'Wander',
        'template': pag
    })
})

module.exports = routerClient;