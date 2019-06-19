const Serie = require('../models/serie')

const findAll = async (req, res) => {
    const series = await Serie.find({})
    res.send(series)
}

const findById = async (req, res) => {
    const serie = await Serie.findById(req.params.id)
    res.send(serie)
}

const update = async (req, res) => {
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
}

const create = async (req, res) => {
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
}

const remove = async (req, res) => {
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
}

module.exports = {
    findAll,
    findById,
    update,
    create,
    remove
}