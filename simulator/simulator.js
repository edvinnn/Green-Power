const mongoose = require('mongoose')
const Model = require('./model')

// Connect to database
mongoose.connect('mongodb://localhost/SimulatorDB', { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('simulator/simulator connected to database'))

let last_wind = 0;
let last_consumption = 0;

currentWind = async function() {
    // fetch previous value
    const wind = await Model.Wind.find().sort({_id:-1}).limit(1).exec()
    console.log("wind speed: " + wind[0].wind + "m/s")

    // create new wind
    let db_wind = (wind[0].wind)
    let new_wind = 0;
    const iterations = 5;
    for(var i = iterations; i > 0; i--){
        new_wind += (Math.random()+0.5)*db_wind;
    }
    new_wind = new_wind / iterations;

    // save new wind to db
    var newWind = new Model.Wind({
        wind: new_wind
    })
    newWind.save(function(err){
        if (err){
            console.log(err)
        }
        last_wind = new_wind
    });
};

currentConsumption = async function() {
    // fetch previous value
    const consumption = await Model.Consumer.find().sort({_id:-1}).limit(1).exec()
    console.log("total consumer consumption: " + consumption[0].consumption + "kWh")

    // create new consumption
    let db_consumption = (consumption[0].consumption)
    let new_consumption = 0;
    const iterations = 5;
    for(var i = iterations; i > 0; i--){
        new_consumption += (Math.random()+0.5)*db_consumption;
    }
    new_consumption = new_consumption / iterations;

    // save new wind to db
    var newConsumption = new Model.Consumer({
        consumption: new_consumption
    })
    newConsumption.save(function(err){
        if (err){
            console.log(err)
        }
        last_consumption = new_consumption
    });
};

currentPrice = function(){
    // Simple linear function for price based on wind
    let max_wind = 50
    let min_wind_price = 10
    let wind_price = 0
    if(last_wind > max_wind){
        wind_price = min_wind_price
    } else{
        wind_price = -(last_wind - max_wind) + min_wind_price
    }

    // Simple linear function for price based on demand
    let min_demand_price = 10
    let demand_price = 0
    if(last_consumption < min_demand_price){
        demand_price = min_demand_price
    } else {
        demand_price = (last_consumption / 100) + min_demand_price
    }

    const current_price = wind_price + demand_price
    console.log("Price: " + current_price)
}

// Loops and updates database with new winds
async function run() {
    setInterval(async function(){
        await currentWind()
        await currentConsumption()
        currentPrice()
    }, 5000)
};

run()
