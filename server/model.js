const mongoose = require('mongoose');

const windSchema = new mongoose.Schema({
    wind: {
        type: Number,
        required: true
      }
});

module.exports = mongoose.model('Wind', windSchema);
