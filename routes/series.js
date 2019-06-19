const express = require('express')
const router = express.Router()
const Serie = require('../models/serie')

router.get('/', async (req, res) => {
    const series = await Serie.find({})
    res.send(series)
})

router.get('/:id', async (req, res) => {
    const serie = await Serie.findById(req.params.id)
    res.send(serie)
})

router.put('/:id', async (req, res) => {
    const { name, status } = req.body
    try {
        const serie = await Serie.findByIdAndUpdate(req.params.id, { name, status }, { new: true })
        res.send(serie)
    } catch (e) {
        res.send({
            success: false,
            errors: Object.keys(e.errors)
        })
    }
})

router.post('/', async (req, res) => {
    const { name, status } = req.body
    const serie = new Serie({ name, status })
    try {
        await serie.save()
        res.send(serie)
    } catch (e) {
        res.send({
            success: false,
            errors: Object.keys(e.errors)
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Serie.remove({ _id: req.params.id })
        res.send({
            success: true
        })
    } catch (e) {
        res.send({
            success: false,
            errors: Object.keys(e.errors)
        })
    }
})

module.exports = router