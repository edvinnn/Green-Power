const sim_db_utils = require('./sim_db_utils');
const server_db_utils = require('../server/server_db_utils');
const { Observable } = require('rxjs');

let last_wind = 0;
let last_consumption = 0;
let households = process.env.HOUSEHOLDS

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
        new_wind = new_wind + Math.random() * 2
    }

    new_wind = new_wind.toFixed(2)

    await sim_db_utils.updateWind(new_wind)
    last_wind = new_wind

    return new_wind
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

    return new_consumption
};

modelledPrice = async function(){

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

    const modelled_price = (wind_price + consumption_price).toFixed(2)

    await sim_db_utils.updateModelledPrice(modelled_price)

    return modelled_price;
}

// Update all prosumers with new random production based on wind
prosumerProduction = async function () {
    const prosumers = await server_db_utils.getAllProsumers()
    const wind = last_wind
    let new_production = 0
    const iterations = 10

    for(const prosumer of prosumers){
        for(var i = iterations; i > 0; i--){
            new_production += (Math.random()+0.5)*wind
        }
        new_production = new_production / (iterations * 5)

        // Max production
        if(new_production > 17){
            new_production = 17 - Math.random()
        }

        await server_db_utils.updateProductionById(prosumer.id, new_production.toFixed(2))
    }
}

prosumerConsumption = async function () {
    const prosumers = await server_db_utils.getAllProsumers()
    let new_consumption = 0
    const iterations = 10
    for(const prosumer of prosumers){
        for(var i = iterations; i>0; i--){
            new_consumption += (Math.random() * prosumer.consumption)
        }
        new_consumption = new_consumption / iterations

        // min consumption
        if(new_consumption < 2.3){
            new_consumption = 2.3 + Math.random()
        }

        // max consumption
        if(new_consumption > 3.7){
            new_consumption = 3.7 - Math.random()
        }

        await server_db_utils.updateConsumptionById(prosumer.id, new_consumption.toFixed(2))
    }
}

// updates buffer based on net production
userBuffer = async function () {

    const users = await server_db_utils.getAllUsers()
    for(const user of users){

        // net production
        let net = user.production - user.consumption

        // update buffer based on net production model
        let buffer_model = (net / 10)

        let new_buffer = user.buffer + buffer_model

        let diff = new_buffer - user.buffer

        if (new_buffer > user.buffer_max){
            new_buffer = user.buffer_max
        }

        if(new_buffer < 0) {
            new_buffer = 0
        }

        const current_price = await sim_db_utils.getLatestPrice()

        if(net > 0){
            // selling with positive net production
            if(user.over_production_sell > 0){
                let sell = diff * user.over_production_sell * current_price
                let conserve = diff * (1 - user.over_production_sell)

                if(user.buffer + conserve > user.buffer_max){
                    await server_db_utils.updateBalanceById(user.id, (user.balance + sell).toFixed(2))
                    await server_db_utils.updateBufferById(user.id, (user.buffer_max).toFixed(2))
                }
                else {
                    await server_db_utils.updateBalanceById(user.id, (user.balance + sell).toFixed(2))
                    await server_db_utils.updateBufferById(user.id, (user.buffer + conserve).toFixed(2))
                }
            }
            // buying with positive net production not possible atm (should not necessarily buy) or if both sliders set to 0
            else{
                await server_db_utils.updateBufferById(user.id, new_buffer.toFixed(2))
            }
        }
        else {
            // buying with negative net production
            if(user.under_production_buy > 0){
                let buy = -diff * user.under_production_buy * current_price
                let conserve = -diff * (1 - user.under_production_buy)

                if(user.balance >= buy){
                    if(user.buffer - conserve < 0){
                        await server_db_utils.updateBufferById(user.id, 0)
                    }
                    else {
                        await server_db_utils.updateBalanceById(user.id, (user.balance - buy).toFixed(2))
                        await server_db_utils.updateBufferById(user.id, (user.buffer - conserve).toFixed(2))
                    }
                } else {
                    // not enough money
                    await server_db_utils.updateBufferById(user.id, new_buffer.toFixed(2))
                }
            }
            // selling with negative net production not possible atm (should not necessarily sell) or if both sliders set to 0
            else{
                await server_db_utils.updateBufferById(user.id, new_buffer.toFixed(2))
            }
        }
    }
}

const observable = new Observable(subscriber => {
    setInterval(async () => {
        await currentWind()
        await consumerConsumption()
        await modelledPrice()
        await prosumerProduction()
        await prosumerConsumption()
        await userBuffer()
        subscriber.next();
    }, process.env.SIMULATOR_TIME);
});

module.exports = {
    observable: observable
}
