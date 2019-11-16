const express = require('express')
const router = express.Router()
const Model = require('./../model')
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
    res.render('index.ejs', {name: 'Edvin & Hampus'})
})

router.get('/login', async (req, res) => {
    res.render('login.ejs')
})

router.post('/login', async (req, res) => {
})

router.get('/register', async (req, res) => {
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

module.exports = router