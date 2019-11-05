'use strict';

module.exports = function(app) {
    var simulator = require('../controllers/simulatorController');

    app.route('/wind').post(simulator.create_wind);
};
