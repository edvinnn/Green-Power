//if (process.env.NODE_ENV !== 'production') {
//    require('dotenv').config()
//}
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cfenv = require('cfenv')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view-engine', 'ejs')

var appEnv = cfenv.getAppEnv();

//Setup routes
//const api_routes = require('./api/routes')
//const web_routes = require('./website/routes')
//app.use('/api', api_routes)
//app.use('/', web_routes)

app.get('/', async (req, res) => {
    res.render('index.ejs', {name: 'Hello, world!'})
})

app.listen(appEnv.port, () => console.log('server started'))