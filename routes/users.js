const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const authMiddleware = require('../middlewares/auth')

router.use(authMiddleware('admin'))

router.get('/', usersController.findAll)

module.exports = router