'use strict';

var mongoose = require('mongoose'),
    Wind = mongoose.model('Wind');

exports.create_wind = function(req, res) {
    var new_wind = new Wind(req, res);
    new_wind.save(function(err, wind) {
        if (err)
            res.send(err);
        res.json(wind);
    });
}


