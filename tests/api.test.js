const request = require('supertest')
const app = require('../app')
const expect = require('chai').expect

const mongoose = require('mongoose')
const mongo = 'mongodb://localhost/minhas-series-api'
mongoose.Promise = global.Promise
const User = require('../models/user')
const Serie = require('../models/serie')

describe('testando RestAPI', () => {
  //antes de realizar os test
  before('conectando ao mongo db', async () => {
    await mongoose.connect(mongo, { useNewUrlParser: true })
    await User.remove({})//remover todos usuarios
    await Serie.remove({})//remover todos series
    const user = new User({
      username: 'leonardo',
      password: '123',
      roles: ['restrito']
    })
    await user.save()
    return true
  })

  it('deve retornar erro', done => {
    request(app)
      .get('/series')
      .expect('Content-Type', /json/)//espero um json
      .expect(200)//espero um codigo 200
      .end((err, res) => {
        expect(err).be.null//espero nenhum erro
        expect(res.body.success).be.false//espero que o corpo tenha success como false
        done()
      })
  })

  it('deve autenticar', done => {
    request(app)
      .post('/auth')
      .send({ username: 'leonardo',password: '123'})
      .expect(200)
      .end((err,res)=>{
        expect(res.body.success).be.true
        expect(res.body.token).be.string
        done()
      })
  })

  it('usuario autenticar invalido', done => {
    request(app)
      .post('/auth')
      .send({username: 'leonardo',password: '1234'})
      .expect(200)
      .end((err,res)=>{
        expect(res.body.success).be.false
        expect(res.body.message).be.string
        done()
      })
  })

  describe('autenticar como restrito',()=>{
    let token=''
    before('get token',(done)=>{
      request(app)
        .post('/auth')
        .send({username: 'leonardo',password: '123'})
        .expect(200)
        .end((err,res)=>{
          token=res.body.token
          done()
        })
    })

    it('Retorna nenhuma serie',(done)=>{
      request(app)
        .get('/series')
        .set('x-access-token',token)
        .expect(200)
        .end((err,res)=>{
          expect(res.body).be.empty
          done()
        })
    })

    it('Criar nova serie',(done)=>{
      request(app)
      .post('/series')
      .set('x-access-token',token)
      .send({name: 'minha serie',status: 'to-watch'})
      .expect(200)
      .end((err,res)=>{
        expect(res.body._id).be.string
        expect(res.body.name).to.equal('minha serie')
        expect(res.body.status).to.equal('to-watch')
        done()
      })
    })
  })
})