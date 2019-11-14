const mongoose = require('mongoose');

const windSchema = new mongoose.Schema({
    wind: {
        type: Number,
        required: true,
        default: 0
      }
});

module.exports = mongoose.model('Wind', windSchema);
