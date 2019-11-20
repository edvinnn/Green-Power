const mongoose = require('mongoose')
const Model = require('./../simulator/model')

mongoose.connect(process.env.SIMULATOR_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Server connected to: ' + process.env.SIMULATOR_DATABASE))