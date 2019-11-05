exports.currentWind = function(v) {
    var wind = v*2;
    var r = 0;
    const iterations = 50;
    for(var i = iterations; i > 0; i--){
        r += Math.random()*wind;
    }
    return r / iterations;
};

exports.getRandomConsumption = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
