const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123'

const init = (role) => async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token
    if (token) {
        try {
            const payload = jwt.verify(token, jwtSecret)
            //se tiver a role restrito ele tem acesso
            if (payload.roles.indexOf(role) >= 0) {
                next()
            } else {
                res.send({
                    success: false
                })
            }
        } catch (e) {
            res.send({
                success: false
            })
        }
    } else {
        res.send({
            success: false,
            message: 'No token'
        })
    }
}

module.exports = init