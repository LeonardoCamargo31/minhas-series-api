const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors =require('cors')

const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDoc = yaml.load('./swagger.yaml')
app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDoc))

const mongo = process.env.MONGODB || 'mongodb+srv://admin:xYHGwvPnAExBZEMy@cluster0-npzcv.mongodb.net/test?retryWrites=true&w=majority'
//para o mongose usar as promise padrão do node
mongoose.Promise = global.Promise

app.use(bodyParser.json({ extended: true }))

app.use(cors())//para todas as origens
//app.use(cors({origin:'http://127.0.0.1:8080'}))//limitando para uma origem

//nesse caso poderiamos ter varios clientes
// app.use(cors({
//     origin:(origin,callback)=>{
//         if(origin==='http://127.0.0.1:8080'){
//             callback(null,true)
//         }else{
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }))

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