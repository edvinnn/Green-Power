const express = require('express')
const router = express.Router()
const server_db_utils = require('./../server_db_utils')

//CONSUMPTION
//Update prosumer consumption by id
router.put('/prosumer/:id/consumption', async (req, res) => {
    try{
        const prosumer = await server_db_utils.updateProsumerConsumptionById(req.params.id, req.body.consumption)
        if (prosumer == null) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    } catch(err) {
        res.status(500).send({message: err.message})
    }
})

// Returns the total of all prosumers consumption
router.get('/prosumer/consumption', async (req, res) => {
    try {
        const prosumers = await server_db_utils.getAllProsumers()
        
        let total_consumption = 0

        prosumers.forEach(element => {
            total_consumption += element.consumption
        });
        res.status(200).json(total_consumption)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Get prosumer consumption by id
router.get('/prosumer/:id/consumption', async (req, res) => {
    try {
        const prosumer = await server_db_utils.getProsumerById(req.params.id)
        if(prosumer == null){
            res.status(404).send()
        } else{
            res.status(200).json(prosumer.consumption)
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// PRODUCTION
// Update prosumer production by id
router.put('/prosumer/:id/production', async (req, res) => {
    try{
        const prosumer = await server_db_utils.updateProsumerProductionById(req.params.id, req.body.production)
        if (prosumer == null) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    } catch(err) {
        res.status(500).send({message: err.message})
    }
})

// Returns the total of all prosumers production
router.get('/prosumer/production', async (req, res) => {
    try {
        const prosumers = await server_db_utils.getAllProsumers()
        let total_production = 0

        prosumers.forEach(element => {
            total_production += element.production
        });

        res.status(200).json(total_production)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Get prosumer production by id
router.get('/prosumer/:id/production', async (req, res) => {
    try {
        const prosumer = await server_db_utils.getProsumerById(req.params.id)
        if (prosumer == null) {
            res.status(404).send()
        } else{
            res.status(200).json(prosumer.production)
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// NET PRODUCTION
// Get prosumer net production by id
router.get('/prosumer/:id/net_production', async(req, res) => {
    try {
        const prosumer = await server_db_utils.getProsumerById(req.params.id)
        if(prosumer == null){
            res.status(404).send()
        } else{
            const current_consumption = prosumer.consumption
            const current_production = prosumer.production
            const net_production = current_production - current_consumption
            res.status(200).json(net_production)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
} )

// BUFFER
// Get prosumer buffer by id
router.get('/prosumer/:id/buffer', async (req, res) => {
    try {
        const prosumer = await server_db_utils.getProsumerById(req.params.id)
        if(prosumer == null){
            res.status(404).send()
        } else{
            res.status(200).json(prosumer.buffer)
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Update prosumer buffer by id
router.put('/prosumer/:id/buffer', async (req, res) => {
    const prosumer = await server_db_utils.updateProsumerBufferById(req.params.id, req.body.buffer)
    try{
        if(prosumer == null){
            res.status(404).send()
        } else{
            res.status(204).send()
        }
    } catch(err) {
        res.status(500).send({message: err.message})
    }
})

// Get prosumer max buffer by id
router.get('/prosumer/:id/buffer_max', async (req, res) => {
    try {
        const prosumer = await server_db_utils.getProsumerById(req.params.id)
        if(prosumer == null){
            res.status(404).send()
        } else {
            res.status(200).json(prosumer.buffer_max)
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Update prosumer max buffer by id
router.put('/prosumer/:id/buffer_max', async (req, res) => {
    try{
        const prosumer = await server_db_utils.updateProsumerBufferSizeById(req.params.id, req.body.buffer_max)
        if (prosumer == null) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    } catch(err) {
        res.status(500).send({message: err.message})
    }
})

module.exports = router