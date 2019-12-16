if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const simulator = require('../simulator/simulator')
const sim_db_utils = require('../simulator/sim_db_utils')
server_db_utils = require('./server_db_utils')
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const express_websocket = require('express-ws')(app);

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

simulator.observable.subscribe({
    next() {
        const clients = express_websocket.getWss().clients;
        clients.forEach(client => {
            sim_db_utils.getLatestPrice().then((price) => {
                //electricity price (ep)
                client.send(JSON.stringify("ep" + price))
            });
            sim_db_utils.getLatestWinds(24).then((winds) => {
                //wind latest 24h (ch)
                client.send("cu" + JSON.stringify(winds))
            });
            //console.log(client)
            /*server_db_utils.getUserById(req.user._id).then((user) => {
                //production (pr)
                client.send(JSON.stringify("pr" + user.production))
                //consumption (co)
                client.send(JSON.stringify("co" + user.consumption))
                //net (ne)
                let net = (user.production - user.consumption).toFixed(2)
                client.send(JSON.stringify("ne" + net))
                //buffer percentage (bu)
                let percentage = ((user.buffer / user.buffer_max) * 100).toFixed(2)
                client.send(JSON.stringify("bu" + percentage))
                //balance (ba)
                client.send(JSON.stringify("ba" + user.balance))
            })*/
        });
    },
    error(err) { console.error('something wrong occurred: ' + err); },
    complete() { console.log('done'); }
});

app.listen(3000, () => console.log('server started'))
