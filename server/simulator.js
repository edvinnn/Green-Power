const mongoose = require('mongoose')

// Connect to database
mongoose.connect('mongodb://localhost/GreenPowerDB', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('simulator connected to database'))

currentWind = function() {
    var Wind = mongoose.model('Wind', windSchema);
    Wind.findOne('wind', function (err, wind) {
        if (err) return handleError(err);
        console.log(wind.wind);
    });
    
    var wind = v*2;
    var r = 0;
    const iterations = 50;
    for(var i = iterations; i > 0; i--){
        r += Math.random()*wind;
    }
    return r / iterations;
};

getRandomConsumption = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

currentPrice = function(min, max) {
    return 5 //TODO: Return actuall value
};

windSimulator = function() {
    while (true) {
        setTimeout(generateWind, 10000)
    }
};

// Loops and updates databse with new winds
exports.run = async function() {
    console.log('I am started!')
    //while (true) {
    //    setTimeout(currentWind, 10000)
    //}
};