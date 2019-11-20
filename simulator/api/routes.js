const express = require('express')
const router = express.Router()
const Model = require('./../model')

// Get 20 latest winds
router.get('/wind', async (req, res) => {
    try {
        const winds = await Model.Wind.find().sort({_id:-1}).limit(20)
        res.json(winds)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get latest wind
router.get('/wind/latest', (req, res) => {
    Model.Wind.find().sort({_id:-1}).limit(1).exec(function(err, wind){
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
    const wind = new Model.Wind({
        wind: req.body.wind
    })

    try {
        const newWind = await wind.save()
        res.status(201).json(newWind)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Get 20 latest consumer consumptions
router.get('/consumer/consumption', async (req, res) => {
    try {
        const consumptions = await Model.Consumer.find().sort({_id:-1}).limit(20)
        res.json(consumptions)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get latest consumption
router.get('/consumer/consumption/latest', (req, res) => {
    Model.Consumer.find().sort({_id:-1}).limit(1).exec(function(err, consumption){
        try {
            res.status(200).json({consumption})
        } catch (err) {
            console.log(err)
            res.status(500)
        }
    })
})

// Create new consumption
router.post('/consumer/consumption', async (req, res) => {
    const consumption = new Model.Consumer({
        consumption: req.body.consumption
    })

    try {
        const newConsumption = await consumption.save()
        res.status(201).json(newConsumption)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Get 20 latest prices
router.get('/price', async (req, res) => {
    try {
        const prices = await Model.Price.find().sort({_id:-1}).limit(20)
        res.json(prices)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get latest price
router.get('/price/latest', (req, res) => {
    Model.Price.find().sort({_id:-1}).limit(1).exec(function(err, price){
        try {
            res.status(200).json({price})
        } catch (err) {
            console.log(err)
            res.status(500)
        }
    })
})

module.exports = router