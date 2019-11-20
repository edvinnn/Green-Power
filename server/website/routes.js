const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const server_db_utils = require('./../server_db_utils')

router.get('/', async (req, res) => {
    res.render('index.ejs')
})

router.get('/profile', checkAuth, async (req, res) => {
    res.render('profile.ejs', {user: req.user})
})

router.get('/dashboard', checkAuth, async (req, res) => {
    res.render('dash.ejs', {user: req.user})
})

router.get('/login', checkNotAuth, async (req, res) => {
    res.render('login.ejs')
})

router.post('/login', passport.authenticate('local', {successRedirect: '/profile', failureRedirect: '/login', failureFlash: true}))

router.get('/register', checkNotAuth, async (req, res) => {
    res.render('register.ejs')
})

router.post('/register', async (req, res) => {
    try {
        const hashed_pwd = await bcrypt.hash(req.body.password, 10)
        const prosumer = server_db_utils.registerNewProsumer(req.body.name, req.body.email, hashed_pwd)
        if(prosumer != null) {
            res.redirect('/login')
        } else {
            res.status(500).send({message: "Could not create user."})
        }
    } catch (err) {
        res.status(500)
    }
})

router.get('/logout', checkAuth, (req, res) => {
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