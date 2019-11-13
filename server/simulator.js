const mongoose = require('mongoose')
const Wind = require('./model')

// Connect to database
mongoose.connect('mongodb://localhost/GreenPowerDB', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('simulator connected to database'))

currentWind = function() {
    // fetch previous value
    Wind.find().sort({_id:-1}).limit(1).exec(function(err, wind){
        //console.log(wind[0].wind)
    
        // create new wind
        var t = wind[0].wind*2;
        var r = 0;
        const iterations = 50;
        for(var i = iterations; i > 0; i--){
            r += Math.random()*t;
        }
        t = r / iterations;

        // save new wind to db
        var newWind = new Wind({
            wind: t
        })
        newWind.save(function(err){
            if (err){
                console.log(err)
            }
        });
    })
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
    setInterval(currentWind, 3000)
};