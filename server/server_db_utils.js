const mongoose = require('mongoose')
const Model = require('./model')
const passport = require('passport')
const initializePassport = require('./passport-config')

mongoose.connect(process.env.SERVER_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Server connected to: ' + process.env.SERVER_DATABASE))

initializePassport(
    passport, 
    email => Model.Prosumer.find({email: email}).exec(),
    id => Model.Prosumer.findById(id).exec()
)

updateProsumerConsumptionById = async function(id, consumption) {
    const prosumer = await Model.Prosumer.findOneAndUpdate({"_id": id}, {"consumption": consumption}).exec()
    return prosumer
}

getAllProsumers = async function() {
    const prosumers = await Model.Prosumer.find().exec()
    return prosumers
}

updateProsumerProductionById = async function(id, production) {
    const prosumer = await Model.Prosumer.findOneAndUpdate({"_id": id}, {"production": production}).exec()
    return prosumer
}

getProsumerById = async function(id) {
    const prosumer = await Model.Prosumer.findOne({'_id': req.params.id}).exec()
    return prosumer
}

updateProsumerBufferById = async function(id, buffer) {
    const prosumer = await Model.Prosumer.findOneAndUpdate({"_id": id}, {"buffer": buffer}).exec()
    return prosumer
}

updateProsumerBufferSizeById = async function(id, size) {
    const prosumer = await Model.Prosumer.findOneAndUpdate({"_id": id}, {"buffer_max": size}).exec()
    return prosumer
}

registerNewProsumer = async function(name, email, hashed_password) {
    const prosumer = new Model.Prosumer({
        name: name,
        email: email,
        password: hashed_password
    })
    await prosumer.save()
    return prosumer
}

module.exports = {
    updateProsumerConsumptionById: updateProsumerConsumptionById,
    getAllProsumers: getAllProsumers,
    updateProsumerProductionById: updateProsumerProductionById,
    getProsumerById: getProsumerById,
    updateProsumerBufferById: updateProsumerBufferById,
    updateProsumerBufferSizeById: updateProsumerBufferSizeById,
    registerNewProsumer: registerNewProsumer
}