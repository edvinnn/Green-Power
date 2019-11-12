'use strict';

module.exports = function(app) {
    var simulator = require('../controllers/simulatorController');

    app.route('/api/wind').post(simulator.create_wind).get(simulator.get_wind);
    app.route('/api/consumption').post(simulator.create_consumption).get(simulator.get_consumption);
    app.route('/api/currentprice').get(simulator.get_currentprice);
};


