const mongoose = require('mongoose');

const simulator_connection = mongoose.createConnection(process.env.SIMULATOR_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

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

let Wind = simulator_connection.model('Wind', windSchema, 'winds');
let Consumer = simulator_connection.model('Consumer', consumerSchema, 'consumers');
let Price = simulator_connection.model('Price', priceSchema, 'prices')

module.exports = {
    Wind: Wind,
    Consumer: Consumer,
    Price: Price
}