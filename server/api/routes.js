const express = require('express')
const router = express.Router()
const Model = require('./../model')

router.get('/wind', async (req, res) => {
    try {
        const winds = await Model.Wind.find()
        res.json(winds)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one wind
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

// Update one wind
router.patch('/:id', (req, res) => {
})

// Delete one wind
router.delete('/:id', (req, res) => {
})

// Get all consumer consumptions
router.get('/consumer/consumption', async (req, res) => {
    try {
        const consumptions = await Model.Consumer.find()
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

// Returns the total of all prosumers consumption
router.get('/prosumer/consumption', async (req, res) => {
    try {
        Model.Prosumer.find().exec(function(err, consumption){

            let total_consumption = 0
    
            consumption.forEach(element => {
                total_consumption += element.consumption
                console.log(element.consumption)
            });
    
            res.status(200).json(total_consumption)
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router