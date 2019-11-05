'use strict';

var mongoose = require('mongoose'),
    Wind = mongoose.model('Wind'),
    Consumption = mongoose.model('Consumption'),
    simulator = require('../../simulator.js');

exports.create_wind = function(req, res) {
    var new_wind = new Wind(req, res);
    new_wind.save(function(err, wind) {
        if (err)
            res.send(err);
        res.json(wind);
    });
};

exports.get_wind = function(req, res) {
    res.json(simulator.currentWind(10))
};

exports.get_consumption = function(req, res) {
    res.json(simulator.getRandomConsumption(1, 35));
};

exports.create_consumption = function (req, res) {
    const new_consumption = new Consumption(req, res);
    new_consumption.save(function (err, consumption) {
        if(err)
            res.send(err);
        res.json(consumption);
    });
};
