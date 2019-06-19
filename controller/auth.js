const User = require('../models/user')
const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123'

const authenticate = async (req, res) => {
    const user = req.body
    const userDb = await User.findOne({ username: user.username })
    if (userDb) {
        if (userDb.password === user.password) {
            //geração do token
            const payload = {
                id: userDb._id,
                username: userDb.username,
                roles: userDb.roles
            }
            jwt.sign(payload, jwtSecret, (err, token) => {
                res.send({
                    success: true,
                    token: token
                })
            })
        }
        else {
            res.send({
                success: false,
                message: 'Wrong credentials'
            })
        }
    }
    else {
        res.send({
            success: false,
            message: 'Wrong credentials'
        })
    }
}

module.exports = {
    authenticate
}