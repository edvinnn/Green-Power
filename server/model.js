const mongoose = require('mongoose');

const windSchema = new mongoose.Schema({
    wind: {
        type: Number,
        required: true,
        default: 0
    }
});

const consumptionSchema = new mongoose.Schema({
    consumption: {
        type: Number,
        required: true,
        default: 0
    }
});


let Wind = mongoose.model('Wind', windSchema);
let Consumption = mongoose.model('Consumption', consumptionSchema);

module.exports = {
    Wind: Wind,
    Consumption: Consumption
}
