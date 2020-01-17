const mongoose = require('mongoose');
const server_connection = mongoose.createConnection(process.env.SERVER_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

server_connection.on('connected', () => {
    console.log('connection established successfully to server database');
});

server_connection.on('disconnected', () => {
    console.log('connection disconnected to server database');
});

const userSchema = new mongoose.Schema({
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
        default: 10
    },
    over_production_sell: {
        type: Number,
        required: true,
        default: 0,
        max: 1
    },
    under_production_buy: {
        type: Number,
        required: true,
        default: 0,
        max: 1
    },
    balance: {
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
    },
    isManager: {
        type: Boolean,
        required: true,
        default: false
    },
    production_on_off: {
        type: Boolean,
        required: true,
        default: false
    },
    is_online: {
        type: Boolean,
        required: true,
        default: false
    },
    blackout: {
        type: Boolean,
        required: true,
        default: false
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    blockedCounter: {
        type: Number,
        required: true,
        default: 0
    }
});

const profilePictureSchema = new mongoose.Schema({
    imageUrl: {
        type: String
    },
    category: {
        type: String
    },
    user: {
        type: String,
        required: true,
        default: ""
    }
});

let User = server_connection.model('User', userSchema, 'users');
let Picture = server_connection.model('Picture', profilePictureSchema, 'pictures');

module.exports = {
    User: User,
    Picture: Picture
}
