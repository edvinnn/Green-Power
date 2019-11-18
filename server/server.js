if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const Model = require('./model')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => Model.Prosumer.find({email: email}).exec(),
    id => Model.Prosumer.findById(id).exec()
)

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

// Connect to database
mongoose.connect(process.env.SERVER_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Server connected to: ' + process.env.SERVER_DATABASE))

// Setup routes
const api_routes = require('./api/routes')
const web_routes = require('./website/routes')
app.use('/api', api_routes)
app.use('/', web_routes)

app.listen(3000, () => console.log('server started'))