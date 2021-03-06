if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const server_db_utils = require('../server_db_utils')

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    res.render('index.ejs', {name: 'Welcome!'})
})

router.get('/profile', checkAuth, async (req, res) => {
    let pictureUrl = await server_db_utils.retriveUserHouseImage(req.user._id);
    res.render('profile.ejs', {user: req.user, image: pictureUrl})
})

router.get('/login', checkNotAuth, async (req, res) => {
    res.render('login.ejs')
})

router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard' ,failureRedirect: '/login', failureFlash: true}))

router.get('/register', checkNotAuth, async (req, res) => {
    res.render('register.ejs')
})

router.post('/register', async (req, res) => {
    try {
        const hashed_pwd = await bcrypt.hash(req.body.password, 10)
        const user = await server_db_utils.registerNewUser(req.body.name, req.body.email.toLowerCase(), hashed_pwd, false, 10)
        if(user != null) {
            req.login(user, function(err) {
                if(err) { return next(err); }
                return res.redirect('/dashboard')
            });
        } else {
            res.status(500).send({message: "Could not create user."})
        }
    } catch (err) {
        res.status(500)
    }
})

router.get('/dashboard', checkAuth, async (req, res) => {
    let pictureUrl = await server_db_utils.retriveUserHouseImage(req.user._id);
    if(req.user.isManager){
        await server_db_utils.updateOnlineById(req.user._id, true)
        res.render('manager-dashboard.ejs', {user: req.user, ws: process.env.SERVER_WS_ADDRESS, api: process.env.SERVER_ADDRESS, image: pictureUrl})
    } else {
        await server_db_utils.updateOnlineById(req.user._id, true)
        res.render('dashboard.ejs', {user: req.user, ws: process.env.SERVER_WS_ADDRESS, api: process.env.SERVER_ADDRESS, image: pictureUrl})
    }
})

router.get('/prosumer_list', checkAuth, async (req, res) => {
    if(req.user.isManager && req.isAuthenticated()){
        let pictureUrl = await server_db_utils.retriveUserHouseImage(req.user._id);
        res.render('manager-list.ejs', {user: req.user, ws: process.env.SERVER_WS_ADDRESS, api: process.env.SERVER_ADDRESS, image: pictureUrl})
    }   else{
        res.status(403).send({message: "Unauthorized."})
    }
})

router.get('/logout', checkAuth, async (req, res) => {
    await server_db_utils.updateOnlineById(req.user._id, false)
    req.logOut()
    res.redirect('/')
})

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router
