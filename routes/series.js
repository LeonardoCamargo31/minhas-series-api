const express = require('express')
const router = express.Router()
const seriesController = require('../controller/series')
const authMiddleware = require('../middlewares/auth')

router.use(authMiddleware('restrito'))

router.get('/', seriesController.findAll)
router.get('/:id', seriesController.findById)
router.put('/:id', seriesController.update)
router.post('/', seriesController.create)
router.delete('/:id',seriesController.remove)

module.exports = router