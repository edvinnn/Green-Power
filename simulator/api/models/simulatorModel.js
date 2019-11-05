var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WindSchema = new Schema({
    name: {
        type: String,
        required: 'Enter current wind'
    },
    Create_date: {
        type: Date,
        default: Date.now
    }
});

var ConsumptionSchema = new Schema({
    name: {
        type: String,
        required: 'Enter current energy consumption'
    },
    Create_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Wind', WindSchema);
module.exports = mongoose.model('Consumption', ConsumptionSchema);
