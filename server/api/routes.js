const express = require('express')
const router = express.Router()
const Wind = require('./model')

// Get all winds
router.get('/wind', async (req, res) => {
    try {
        const winds = await Wind.find()
        res.json(winds)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one wind
router.get('/:id', (req, res) => {
})

// Create new wind
router.post('/wind', async (req, res) => {
    const wind = new Wind({
        wind: req.body.speed
    })

    try {
        const newWind = await wind.save()
        res.status(201).json(newWind)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Update one wind
router.patch('/:id', (req, res) => {
})

// Delete one wind
router.delete('/:id', (req, res) => {
})

module.exports = router