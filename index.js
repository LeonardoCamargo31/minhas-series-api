const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const mongo = process.env.MONGODB || 'mongodb://localhost/minhas-series-api'
//para o mongose usar as promise padrão do node
mongoose.Promise = global.Promise

app.use(bodyParser({ extended: true }))

const seriesRouter = require('./routes/series')
app.use('/series', seriesRouter)

mongoose.connect(mongo, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
}).catch((e) => {
    console.log('Não possível conectar ao banco de dados, erro: ' + e)
})
