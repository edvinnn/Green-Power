const Model = require('../server/model')

updateProduction = async function(id, new_production) {
    return await Model.Prosumer.findOneAndUpdate({"_id": id}, {"production": new_production}).exec()
}

updateConsumption = async function(id, new_consumption) {
    return await Model.Prosumer.findOneAndUpdate({"_id": id}, {"consumption": new_consumption}).exec()
}

updateBuffer = async function(id, new_buffer) {
    return await Model.Prosumer.findOneAndUpdate({"_id": id}, {"buffer": new_buffer}).exec()
}

getAllProsumers = async function() {
    return await Model.Prosumer.find().exec()
}

module.exports = {
    updateProduction: updateProduction,
    getAllProsumers: getAllProsumers,
    updateConsumption: updateConsumption,
    updateBuffer: updateBuffer
}