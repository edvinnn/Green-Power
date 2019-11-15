const express = require('express')
const router = express.Router()
const Model = require('./../model')

//Update specific prosumer's consumption
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