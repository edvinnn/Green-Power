if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const simulator = require('../simulator/simulator')
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const express_websocket = require('express-ws')(app);

app.use(express.static('green-power-public'))
app.use('/user_uploads', express.static('user_uploads'))
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

// Wss handling - update clients when to refresh for new dashboard data
simulator.observable.subscribe({
    next() {
        const clients = express_websocket.getWss().clients;
        clients.forEach(client => {
            client.send('refresh');
        });
    },
    error(err) { console.error('something wrong occurred: ' + err); },
    complete() { console.log('done'); }
});

app.listen(3000, () => console.log('server started'))
