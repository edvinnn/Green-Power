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
        console.log(wind[0].wind)
    
        // create new wind
        let db_wind = (wind[0].wind)
        let new_wind = 0;
        const iterations = 5;
        for(var i = iterations; i > 0; i--){
            new_wind += (Math.random()+0.5)*db_wind;
        }
        new_wind = new_wind / iterations;

        // save new wind to db
        var newWind = new Wind({
            wind: new_wind
        })
        newWind.save(function(err){
            if (err){
                console.log(err)
            }
        });
    })
};

// Loops and updates databse with new winds
exports.run = async function() {
    setInterval(currentWind, 1000)
};