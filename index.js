const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const mongo = process.env.MONGODB || 'mongodb://localhost/minhas-series-api'
//para o mongose usar as promise padrão do node
mongoose.Promise = global.Promise

app.use(bodyParser.json({ extended: true }))

const User = require('./models/user')
const seriesRouter = require('./routes/series')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

app.use('/auth', authRouter)
app.use('/series', seriesRouter)
app.use('/users', usersRouter)

const createInitialUsers = async()=>{
    const total = await User.count({})
    if(total===0){
        const user = new User({
            username:'leonardo',
            password:'123',
            roles: ['restrito','admin']
        })
        await user.save()

        const user2 = new User({
            username:'restrito',
            password:'123',
            roles: ['restrito']
        })
        await user2.save()
    }
}

mongoose.connect(mongo, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => {
        createInitialUsers()
        console.log(`Servidor rodando na porta ${port}`)
    })
}).catch((e) => {
    console.log('Não possível conectar ao banco de dados, erro: ' + e)
})