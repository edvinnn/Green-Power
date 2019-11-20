const express = require('express')
const router = express.Router()
const sim_db_utils = require('../sim_db_utils')

// Get 20 latest winds
router.get('/wind', async (req, res) => {
    try {
        const winds = await sim_db_utils.getLatestWinds(20)
        res.status(200).json(winds)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get latest wind
router.get('/wind/latest', async (req, res) => {
    try {
        const wind = await sim_db_utils.getLatestWind()
        res.status(200).json({wind})
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

// Create new wind
router.post('/wind', async (req, res) => {
    try {
        await sim_db_utils.updateWind(req.body.wind)
        const wind = await sim_db_utils.getLatestWind()
        res.status(201).json(wind)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Get 20 latest consumer consumptions
router.get('/consumer/consumption', async (req, res) => {
    try {
        const consumptions = await sim_db_utils.getLatestConsumptions(20)
        res.status(200).json(consumptions)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get latest consumption
router.get('/consumer/consumption/latest',async (req, res) => {
    try {
        const consumption = await sim_db_utils.getLatestConsumption()
        res.status(200).json({consumption})
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

// Create new consumption
router.post('/consumer/consumption', async (req, res) => {
    try {
        await sim_db_utils.updateConsumption(req.body.consumption)
        const consumption = await sim_db_utils.getLatestConsumption()
        res.status(201).json(consumption)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Get 20 latest prices
router.get('/price', async (req, res) => {
    try {
        const prices = await sim_db_utils.getLatestPrices(20)
        res.status(200).json(prices)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get latest price
router.get('/price/latest', async (req, res) => {
    try {
        const price = await sim_db_utils.getLatestPrice()
        res.status(200).json({price})
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

module.exports = router