const express = require('express')
const router = express.Router()
const Model = require('./../model')

router.get('/', async (req, res) => {
    res.render('index.ejs', {name: 'Edvin & Hampus'})
})

module.exports = router