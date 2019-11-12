'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
    mongoose = require('mongoose'),
    Wind = require('./api/models/simulatorModel'),
    bodyParser = require('body-parser');

// mongoose instance connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/GreenPowerDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/simulatorRoutes');
routes(app);


app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
