const mongoose = require('mongoose');

const simulator_connection = mongoose.createConnection(process.env.SIMULATOR_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

simulator_connection.on('connected', () => {
    console.log('connection established successfully to simulator database');
});

simulator_connection.on('disconnected', () => {
    console.log('connection disconnected to simulator database');
});

const windSchema = new mongoose.Schema({
    wind: {
        type: Number,
        required: true,
        default: 0
    }
})

const consumerSchema = new mongoose.Schema({
    consumption: {
        type: Number,
        required: true,
        default: 0
    }
})

const priceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        default: 0
    }
})

const modelPriceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        default: 0
    }
})

let Wind = simulator_connection.model('Wind', windSchema, 'winds');
let Consumer = simulator_connection.model('Consumer', consumerSchema, 'consumers');
let Price = simulator_connection.model('Price', priceSchema, 'prices')
let ModelPrice = simulator_connection.model('ModelPrice', modelPriceSchema, 'modelled_prices')

module.exports = {
    Wind: Wind,
    Consumer: Consumer,
    Price: Price,
    ModelPrice: ModelPrice
}