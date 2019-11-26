const Model = require('./model')

getLatestWind = async function () {
    const wind = await Model.Wind.find().sort({_id:-1}).limit(1).exec()
    return (wind[0].wind)
}

getLatestWinds = async function (quantity) {
    return await Model.Wind.find().sort({_id: -1}).limit(quantity).exec()
}

updateWind = async function(new_wind){
    var newWind = new Model.Wind({
        wind: new_wind
    })
    await newWind.save(function(err){
        if (err){
            console.log(err)
        }
    });
}

getLatestConsumption = async function () {
    const consumption = await Model.Consumer.find().sort({_id:-1}).limit(1).exec()
    return consumption[0].consumption
}

getLatestConsumptions = async function (quantity) {
    return await Model.Consumer.find().sort({_id: -1}).limit(quantity).exec()
}

updateConsumption = async function (new_consumption) {
    var newConsumption = new Model.Consumer({
        consumption: new_consumption
    })
    newConsumption.save(function (err) {
        if (err) {
            console.log(err)
        }
    });
}

getLatestPrice = async function () {
    const price = await Model.Price.find().sort({_id:-1}).limit(1).exec()
    return price[0].price
}

getLatestPrices = async function (quantity) {
    return await Model.Price.find().sort({_id: -1}).limit(quantity).exec()
}

updatePrice = async function (current_price) {
    const newPrice = new Model.Price({
        price: current_price
    })
    newPrice.save(function (err) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    getLatestWind: getLatestWind,
    getLatestWinds: getLatestWinds,
    updateWind: updateWind,
    getLatestConsumption: getLatestConsumption,
    getLatestConsumptions: getLatestConsumptions,
    updateConsumption: updateConsumption,
    getLatestPrice: getLatestPrice,
    getLatestPrices: getLatestPrices,
    updatePrice: updatePrice,
}