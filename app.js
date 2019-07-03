const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

//documentação da api
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDoc = yaml.load('./swagger.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(bodyParser.json({ extended: true }))

app.use(cors())//para todas as origens

const seriesRouter = require('./routes/series')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

app.use('/auth', authRouter)
app.use('/series', seriesRouter)
app.use('/users', usersRouter)

module.exports = app