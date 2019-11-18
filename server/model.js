const mongoose = require('mongoose');

const prosumerSchema = new mongoose.Schema({
    consumption: {
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

let Prosumer = mongoose.model('Prosumer', prosumerSchema);

module.exports = {
    Prosumer: Prosumer
}
