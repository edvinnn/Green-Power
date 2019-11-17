const express = require('express')
const router = express.Router()
const Model = require('./../model')
const bcrypt = require('bcrypt')
const passport = require('passport')

router.get('/', async (req, res) => {
    res.render('index.ejs', {name: 'Hello, world!'})
})

router.get('/profile', checkAuth, async (req, res) => {
    console.log(req.user)
    res.render('index.ejs', {name: req.user.name})
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

        const prosumer = new Model.Prosumer({
            name: req.body.name,
            email: req.body.email,
            password: hashed_pwd
        })

        await prosumer.save()

        res.redirect('/login')
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