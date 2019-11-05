'use strict';

module.exports = function(app) {
    var simulator = require('../controllers/simulatorController');

    app.route('/wind').post(simulator.create_wind).get(simulator.get_wind);
    app.route('/consumption').post(simulator.create_consumption).get(simulator.get_consumption);
};


