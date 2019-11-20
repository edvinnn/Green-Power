const mongoose = require('mongoose');

const prosumerSchema = new mongoose.Schema({
    consumption: {
        type: Number,
        required: true,
        default: 0
    },
    production: {
        type: Number,
        required: true,
        default: 0
    },
    buffer: {
        type: Number,
        required: true,
        default: 0
    },
    buffer_max: {
        type: Number,
        required: true,
        default: 0
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    email: {
        type: String,
        required: true,
        default: ""
    },
    password: {
        type: String
    }
});

let Prosumer = mongoose.model('Prosumer', prosumerSchema, 'prosumers');

module.exports = {
    Prosumer: Prosumer
}
