const mongoose = require('mongoose');

const windSchema = new mongoose.Schema({
    wind: {
        type: Number,
        required: true,
        default: 0
    }
});

const consumerSchema = new mongoose.Schema({
    consumption: {
        type: Number,
        required: true,
        default: 0
    }
});

const priceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        default: 0
    }
})

const prosumerProductionSchema = new mongoose.Schema({
    production: {
        type: Number,
        required: true,
        default: 0
    }
})

let Wind = mongoose.model('Wind', windSchema, 'winds');
let Consumer = mongoose.model('Consumer', consumerSchema, 'consumers');
let Price = mongoose.model('Price', priceSchema, 'prices')
let ProsumerProduction = mongoose.model('ProsumerProduction', prosumerProductionSchema, 'prosumerProductions')

module.exports = {
    Wind: Wind,
    Consumer: Consumer,
    Price: Price,
    ProsumerProduction: ProsumerProduction
}