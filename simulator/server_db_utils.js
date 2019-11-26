const Model = require('../server/model')

updateProduction = async function(id, new_production) {
    return await Model.Prosumer.findOneAndUpdate({"_id": id}, {"production": new_production}).exec()
}

getAllProsumers = async function() {
    return await Model.Prosumer.find().exec()
}

module.exports = {
    updateProduction: updateProduction,
    getAllProsumers: getAllProsumers
}