const sim_db_utils = require('./sim_db_utils')
const server_db_utils = require('../server/server_db_utils')

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

    if (new_wind > 50){
        new_wind = new_wind - Math.random() * 10
    }

    if (new_wind > 30){
        new_wind = new_wind - Math.random() * 5
    }

    if (new_wind < 5){
        new_wind = new_wind + Math.random()
    }

    new_wind = new_wind.toFixed(2)

    await sim_db_utils.updateWind(new_wind)
    last_wind = new_wind
    console.log("wind speed: " + new_wind + " m/s")

}

consumerConsumption = async function() {
    // fetch previous value
    const db_consumption = await sim_db_utils.getLatestConsumption()

    // create new consumption based on previous consumption
    let new_consumption = 0
    const iterations = 5
    for(var i = iterations; i > 0; i--){
        new_consumption += (Math.random()+0.5)*db_consumption
    }
    new_consumption = new_consumption / iterations

    // max consumption
    if (new_consumption > (11 * households)){
        new_consumption = 11 * households * Math.random()
    }

    if (new_consumption < (households)){
        new_consumption = new_consumption + Math.random() * households
    }

    new_consumption = new_consumption.toFixed(2)

    await sim_db_utils.updateConsumption(new_consumption)
    last_consumption = new_consumption

    console.log("total consumer consumption: " + new_consumption + " kWh")
};

currentPrice = async function(){

    // Simple linear function for price based on wind
    let max_wind = 50
    let min_wind = 10
    let wind_price = 0
    if(last_wind > max_wind){
        wind_price = min_wind / 100
    } else{
        wind_price = (-(last_wind - max_wind) + min_wind) / 100
    }

    // Simple linear function for price based on consumption
    let max_consumption_price = 0.6
    let min_consumption_price = 0.1
    let consumption_per_household = last_consumption / households
    let consumption_price = 0
    if((consumption_per_household / 10) > max_consumption_price){
        consumption_price = max_consumption_price
    } else if((consumption_per_household / 10) < min_consumption_price){
        consumption_price = min_consumption_price
    } else {
        consumption_price = consumption_per_household / 10
    }

    const current_price = (wind_price + consumption_price).toFixed(2)

    await sim_db_utils.updatePrice(current_price)

    console.log("current price: " + current_price + " kr/kWh")
}

// Update all prosumers with new random production based on wind
prosumerProduction = async function () {
    const prosumers = await server_db_utils.getAllProsumers()
    const wind = last_wind
    let new_production = 0
    const iterations = 5

    for(const prosumer of prosumers){
        for(var i = iterations; i > 0; i--){
            new_production += (Math.random()+0.5)*wind
        }
        new_production = new_production / (iterations * 5)

        // Max production
        if(new_production > 17){
            new_production = 17 - Math.random()
        }

        await server_db_utils.updateProsumerProductionById(prosumer.id, new_production.toFixed(2))
    }
}

prosumerConsumption = async function () {
    const prosumers = await server_db_utils.getAllProsumers()
    let new_consumption = 0
    const iterations = 5
    for(const prosumer of prosumers){
        for(var i = iterations; i>0; i--){
            new_consumption += (Math.random() * prosumer.consumption)
        }
        new_consumption = new_consumption / iterations

        if(new_consumption < 2){
            new_consumption = new_consumption + Math.random() * 4
        }

        // max consumption
        if(new_consumption > 11) {
            new_consumption =  Math.random() * 11
        }
        await server_db_utils.updateProsumerConsumptionById(prosumer.id, new_consumption.toFixed(2))
    }
}

// updates buffer based on net production
prosumerBuffer = async function () {

    const prosumers = await server_db_utils.getAllProsumers()
    for(const prosumer of prosumers){

        // net production
        let net = prosumer.production - prosumer.consumption

        // update buffer based on net production model
        let buffer_model = (net / 10)

        let new_buffer = prosumer.buffer + buffer_model

        if (new_buffer > prosumer.buffer_max){
            new_buffer = prosumer.buffer_max
        }

        if(new_buffer < 0) {
            new_buffer = 0
        }

        const current_price = await sim_db_utils.getLatestPrice()

        // selling with positive net production
        if((prosumer.over_production_sell > 0) && (net > 0)) {

            let diff = new_buffer - prosumer.buffer
            let sell = diff * prosumer.over_production_sell * current_price
            let conserve = diff * (1 - prosumer.over_production_sell)

            await server_db_utils.updateBalanceById(prosumer.id, (prosumer.balance + sell).toFixed(2))
            await server_db_utils.updateProsumerBufferById(prosumer.id, (new_buffer - conserve).toFixed(2))
        }

        // selling with negative net production not possible atm (should not necessarily sell)
        if((prosumer.over_production_sell > 0) && (net < 0)){
            await server_db_utils.updateProsumerOverProductionById(prosumer.id, 0)
            await server_db_utils.updateProsumerBufferById(prosumer.id, new_buffer.toFixed(2))
        }

        // buying with negative net production
        if((prosumer.under_production_buy > 0) && (net < 0)) {

            let diff = prosumer.buffer - new_buffer
            let buy = diff * prosumer.under_production_buy * current_price
            let bought = diff * prosumer.under_production_buy

            if(prosumer.balance >= buy){
                await server_db_utils.updateBalanceById(prosumer.id, (prosumer.balance - buy).toFixed(2))
                await server_db_utils.updateProsumerBufferById(prosumer.id, (new_buffer + bought).toFixed(2))
            } else {
                // not enough money
                await server_db_utils.updateProsumerUnderProductionById(prosumer.id, 0)
                await server_db_utils.updateProsumerBufferById(prosumer.id, new_buffer.toFixed(2))
            }
        }

        // buying with positive net production not possible atm (should not necessarily buy)
        if((prosumer.under_production_buy > 0) && (net > 0)){
            await server_db_utils.updateProsumerUnderProductionById(prosumer.id, 0)
            await server_db_utils.updateProsumerBufferById(prosumer.id, new_buffer.toFixed(2))
        }

        if((prosumer.under_production_buy === 0) && (prosumer.over_production_sell === 0)){
            await server_db_utils.updateProsumerBufferById(prosumer.id, new_buffer.toFixed(2))
        }

    }
}

//Loops and updates database with new simulator values
async function run() {
    setInterval(async function(){
        await currentWind()
        await consumerConsumption()
        await currentPrice()
        await prosumerProduction()
        await prosumerConsumption()
        await prosumerBuffer()
    }, 5000)
}

run()