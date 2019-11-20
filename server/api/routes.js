const express = require('express')
const router = express.Router()
const Model = require('./../model')

//CONSUMPTION
//Update prosumer consumption by id
router.put('/prosumer/:id/consumption', async (req, res) => {

    Model.Prosumer.findOneAndUpdate({"_id": req.params.id}, {"consumption":req.body.consumption}, function (err, u) {
        try{
            if(u == null){
                res.status(404).send()
            } else{
                res.status(204).send()
            }
        } catch(err) {
            res.status(500).send({message: err.message})
        }
    })
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

// Get prosumer consumption by id
router.get('/prosumer/:id/consumption', async (req, res) => {
    try {
        Model.Prosumer.findOne({'_id': req.params.id}).exec(function (err, consumption) {
            res.status(200).json(consumption.consumption)
        })
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// PRODUCTION
// Update prosumer production by id
router.put('/prosumer/:id/production', async (req, res) => {

    Model.Prosumer.findOneAndUpdate({"_id": req.params.id}, {"production":req.body.production}, function (err, u) {
        try{
            if(u == null){
                res.status(404).send()
            } else{
                res.status(204).send()
            }
        } catch(err) {
            res.status(500).send({message: err.message})
        }
    })
})

// Returns the total of all prosumers production
router.get('/prosumer/production', async (req, res) => {
    try {
        Model.Prosumer.find().exec(function(err, production){

            let total_production = 0

            production.forEach(element => {
                total_production += element.production
                console.log(element.production)
            });

            res.status(200).json(total_production)
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Get prosumer production by id
router.get('/prosumer/:id/production', async (req, res) => {
    try {
        Model.Prosumer.findOne({'_id': req.params.id}).exec(function (err, production) {
            res.status(200).json(production.production)
        })
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// NET PRODUCTION
// Get prosumer net production by id
router.get('/prosumer/:id/net_production', async(req, res) => {
    try {
        Model.Prosumer.findOne({'_id': req.params.id}, ).exec(function (err, prosumer) {
            const current_consumption = prosumer.consumption
            const current_production = prosumer.production
            const net_production = current_production - current_consumption
            res.status(200).json(net_production)
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
} )

// BUFFER
// Get prosumer buffer by id
router.get('/prosumer/:id/buffer', async (req, res) => {
    try {
        Model.Prosumer.findOne({'_id': req.params.id}).exec(function (err, buffer) {
            res.status(200).json(buffer.buffer)
        })
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Get prosumer max buffer by id
router.get('/prosumer/:id/buffer_max', async (req, res) => {
    try {
        Model.Prosumer.findOne({'_id': req.params.id}).exec(function (err, buffer_max) {
            res.status(200).json(buffer_max.buffer_max)
        })
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


module.exports = router