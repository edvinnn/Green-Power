const express = require('express')
const router = express.Router()
var expressWs = require('express-ws')(router)
const server_db_utils = require('../server_db_utils')
const sim_db_utils = require('../../simulator/sim_db_utils')

router.ws('/dashboard', function (ws, req) {
    ws.on('message', function (msg) {
        if(msg === 'connection') {
            // Add new client to cleints list
            console.log('New WS connection...')
            console.log(req)
            // TODO: Add user to session storage/hashtable
        
            // Push latest data to client
            sim_db_utils.getLatestPrice().then((price) => {
                //electricity price (ep)
                ws.send(JSON.stringify("ep" + price))
            });
            sim_db_utils.getLatestWinds(24).then((winds) => {
                //wind latest 24h (ch)
                ws.send("ch" + JSON.stringify(winds))
            });
            server_db_utils.getUserById(req.user._id).then((user) => {
                //production (pr)
                ws.send(JSON.stringify("pr" + user.production))
                //consumption (co)
                ws.send(JSON.stringify("co" + user.consumption))
                //net (ne)
                let net = (user.production - user.consumption).toFixed(2)
                ws.send(JSON.stringify("ne" + net))
                //buffer percentage (bu)
                let percentage = ((user.buffer / user.buffer_max) * 100).toFixed(2)
                ws.send(JSON.stringify("bu" + percentage))
                //balance (ba)
                ws.send(JSON.stringify("ba" + user.balance))
            });
        }
    });
});

//CONSUMPTION
//Update prosumer consumption by id
router.put('/prosumer/:id/consumption', async (req, res) => {

    try{
        const prosumer = await server_db_utils.updateConsumptionById(req.params.id, req.body.consumption)
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
        const prosumer = await server_db_utils.getUserById(req.params.id)
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
        const prosumer = await server_db_utils.updateProductionById(req.params.id, req.body.production)
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
        const prosumer = await server_db_utils.getUserById(req.params.id)
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
        const prosumer = await server_db_utils.getUserById(req.params.id)
        if(prosumer == null){
            res.status(404).send()
        } else{
            const net_production = prosumer.production - prosumer.consumption
            res.status(200).json(net_production)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// SELL AND BUY RATIO
router.put('/prosumer/:id/sell_ratio/:ratio', checkAuth, async(req, res) => {
    if(req.user._id == req.params.id){
        try {
            server_db_utils.updateOverProductionById(req.params.id, req.params.ratio).then(() => {
                res.status(200).send()
            });
        } catch (err) {
            res.status(500).json({message: "Serverside error."})
        };
    } else {
        res.status(403).json({message: "Forbidden."})
    }
});

router.put('/prosumer/:id/buy_ratio/:ratio', checkAuth, async(req, res) => {
    if(req.user._id == req.params.id){
        try {
            server_db_utils.updateUnderProductionById(req.params.id, Number(req.params.ratio)).then(() => {
                res.status(200).send()
            })
        } catch (err) {
            res.status(500).json({message: "Serverside error."})
        }
    } else {
        res.status(403).json({message: "Forbidden."})
    }
});

router.get('/prosumer/:id/sell_ratio', checkAuth, async(req, res) => {
    if(req.user._id == req.params.id){
        try {
            server_db_utils.getUserById(req.params.id).then((prosumer) => {
                res.status(200).json(prosumer.over_production_sell)
            })
        } catch (err) {
            res.status(500).json({message: "Serverside error."})
        };
    } else {
        res.status(403).json({message: "Forbidden."})
    }
});

router.get('/prosumer/:id/buy_ratio', checkAuth, async(req, res) => {
    if(req.user._id == req.params.id){
        try {
            server_db_utils.getUserById(req.params.id).then((prosumer) => {
                res.status(200).json(prosumer.under_production_buy)
            })
        } catch (err) {
            res.status(500).json({message: "Serverside error."})
        };
    } else {
        res.status(403).json({message: "Forbidden."})
    }
});


// BUFFER
// Get prosumer buffer by id
router.get('/prosumer/:id/buffer', async (req, res) => {
    try {
        const prosumer = await server_db_utils.getUserById(req.params.id)
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
    const prosumer = await server_db_utils.updateBufferById(req.params.id, req.body.buffer)
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
        const prosumer = await server_db_utils.getUserById(req.params.id)
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
        const prosumer = await server_db_utils.updateBufferSizeById(req.params.id, req.body.buffer_max)
        if (prosumer == null) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    } catch(err) {
        res.status(500).send({message: err.message})
    }
})

// CHANGE USER INFO
router.post('/prosumer/change_name', async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.status(403).send()
    }
    try {
        server_db_utils.getUserById(req.user._id).then((user) => {
            user.name = req.body.name
            user.save()
            res.status(200).redirect('/profile')
        })
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
})

// CHANGE USER INFO
router.post('/prosumer/change_email', async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.status(403).send()
    }
    try {
        server_db_utils.getUserById(req.user._id).then((user) => {
            user.email = req.body.email
            user.save()
            res.status(200).redirect('/profile')
        })
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
})

// WINDS
// Get 20 latest winds
router.get('/wind', async (req, res) => {
    try {
        const winds = await sim_db_utils.getLatestWinds(20)
        res.status(200).json(winds)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.ws('/wind/latest', function (ws, req) {
    ws.on('message', function (msg) {
        console.log(msg)
        sim_db_utils.getLatestWind().then((wind) => {
            ws.send(wind)
        });
    });
});

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

// CONSUMER CONSUMPTIONS
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

// PRICES
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

router.ws('/price', function (ws, req) {
    ws.on('message', function (msg) {
        sim_db_utils.getLatestPrices(24).then((prices) => {
            ws.send(JSON.stringify(prices))
        });
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router