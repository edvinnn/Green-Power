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

let Wind = mongoose.model('Wind', windSchema);
let Consumer = mongoose.model('Consumer', consumerSchema);

module.exports = {
    Wind: Wind,
    Consumer: Consumer
}