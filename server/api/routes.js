const express = require('express')
const router = express.Router()
const Wind = require('./../model')

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
router.get('/wind/latest', (req, res) => {
    Wind.find().sort({_id:-1}).limit(1).exec(function(err, wind){
        try {
            res.status(200).json({wind})
        } catch (err) {
            console.log(err)
            res.status(500)
        }
    })
})

// Create new wind
router.post('/wind', async (req, res) => {
    const wind = new Wind({
        wind: req.body.wind
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