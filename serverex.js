require('dotenv').config()
const routerApi = require('./routes/routerApi')
const routerClient = require('./routes/routerClient')
const routerSeg = require('./routes/routerSeg')

const morgan = require('morgan')

const express = require('express')
const cors = require('cors');
const path = require('path')
const app = express()

app.use(morgan('commom'))
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use("/api", routerApi)
app.use("/client", routerClient)
app.use("/seguranca", routerSeg)

app.use('/app', express.static(path.join(__dirname, '/public')))

app.use((req, res) => {
    res.status(404).send("404- Not Found")
})
let port = process.env.PORT || 3000
app.listen(port)