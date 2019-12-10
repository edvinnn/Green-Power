const sim_db_utils = require('./sim_db_utils')
const server_db_utils = require('../server/server_db_utils')

startingProduction = async function () {
    console.log('Starting production of power plant.')

    setTimeout(runningProduction, 30000)
}

runningProduction = async function () {
    console.log('Running production of power plant. ')

    const manager = await server_db_utils.getAllManagers()
    await sim_db_utils.updateManagerProductionById(manager.id, 100)
}

stoppingProduction = async function () {
    console.log('Stopping production of power plant. ')

    const manager = await server_db_utils.getAllManagers()
    await sim_db_utils.updateManagerProductionById(manager.id, 0)

}

module.exports = {
    startingProduction: startingProduction,
    stoppingProduction: stoppingProduction
}