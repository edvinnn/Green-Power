if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
require('../simulator/simulator')

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
const api_web_routes = require('./api/routes')
const api_sim_routes = require('../simulator/api/routes')
const web_routes = require('./website/routes')
app.use('/api', api_web_routes)
app.use('/sim', api_sim_routes)
app.use('/', web_routes)

app.listen(3000, () => console.log('server started'))