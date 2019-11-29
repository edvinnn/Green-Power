const sim_db_utils = require('./sim_db_utils')
const server_db_utils = require('./server_db_utils')

let last_wind = 0;
let last_consumption = 0;

// Number of consumers (households) within the system
let households = 1000;

currentWind = async function() {
    // fetch previous value
    let db_wind = await sim_db_utils.getLatestWind()

    // create new wind based on previous wind
    let new_wind = 0;
    const iterations = 5;
    for(var i = iterations; i > 0; i--){
        new_wind += (Math.random()+0.5)*db_wind;
    }
    new_wind = new_wind / iterations;

    await sim_db_utils.updateWind(new_wind)
    last_wind = new_wind
    console.log("wind speed: " + new_wind + " m/s")

};

currentConsumption = async function() {
    // fetch previous value
    const db_consumption = await sim_db_utils.getLatestConsumption()

    // create new consumption based on previous consumption
    let new_consumption = 0;
    const iterations = 5;
    for(var i = iterations; i > 0; i--){
        new_consumption += (Math.random()+0.5)*db_consumption;
    }
    new_consumption = new_consumption / iterations;

    sim_db_utils.updateConsumption(new_consumption)
    last_consumption = new_consumption

    console.log("total consumer consumption: " + new_consumption + " kWh")
};

currentPrice = async function(){

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
    let max_consumption_price = 60
    let min_demand_price = 10
    let consumption_per_household = last_consumption / households
    let demand_price = 0
    if(consumption_per_household > max_consumption_price){
        demand_price = max_consumption_price
    } else if(consumption_per_household < min_demand_price){
        demand_price = min_demand_price
    } else {
        demand_price = consumption_per_household
    }

    const current_price = wind_price + demand_price

    await sim_db_utils.updatePrice(current_price)

    console.log("current price: " + current_price + " kr/kWh")
}

// Update all prosumers with new random production based on wind
newProduction = async function () {
    const prosumers = await server_db_utils.getAllProsumers()
    const wind = last_wind
    let new_production = 0
    const iterations = 5;
    await prosumers.forEach(element => {
        for(var i = iterations; i > 0; i--){
            new_production += (Math.random()+0.5)*wind;
        }
        new_production = new_production / (iterations * 3)
        server_db_utils.updateProduction(element.id, new_production)
        console.log("Prosumer: " + element.id + " updated with new production: " + new_production)
    })
}

//Loops and updates database with new simulator values
async function run() {
    setInterval(async function(){
        await currentWind()
        await currentConsumption()
        await currentPrice()
        await newProduction()
    }, process.env.SIMULATOR_TIME)
}

run()