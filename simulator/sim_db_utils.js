const Model = require('./model')

getLatestWind = async function () {
    return Model.Wind.find().sort({_id:-1}).limit(1).exec().then((wind) => {
        return wind[0].wind
    })
}

getLatestWinds = async function (quantity) {
    return Model.Wind.find().sort({_id: -1}).limit(quantity).exec().then((winds) => {
        return winds
    })
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
    return Model.Consumer.find().sort({_id:-1}).limit(1).exec().then((consumption) => {
        return consumption[0].consumption
    })
}

getLatestConsumptions = async function (quantity) {
    return Model.Consumer.find().sort({_id: -1}).limit(quantity).exec().then((consumption) => {
        return consumption
    })
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
    return Model.Price.find().sort({_id:-1}).limit(1).exec().then((price) => {
        return price[0].price
    })
}

getLatestPrices = async function (quantity) {
    return Model.Price.find().sort({_id: -1}).limit(quantity).exec().then((prices) => {
        return prices
    })
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