if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
require('../simulator/simulator')
const express = require('express')
const app = express()
const express_websocket = require('express-ws')(app);
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

app.use(express.static('green-power-public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view-engine', 'ejs')

// Setup routes
const api_routes = require('./api/routes')
const web_routes = require('./website/routes')
app.use('/api', api_routes)
app.use('/', web_routes)

app.get('/test', function (req, res, next) {
    const clients = expressWs.getWss().clients;
    clients.forEach(client => {
        console.log("C")
    });
    //console.log(expressWs.getWss().clients);
    res.end();
});

app.listen(3000, () => console.log('server started'))
