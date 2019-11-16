const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view-engine', 'ejs')

// Connect to database
mongoose.connect('mongodb://localhost/GreenPowerDB', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('server connected to database'))

// Setup routes
const api_routes = require('./api/routes')
const web_routes = require('./website/routes')
app.use('/api', api_routes)
app.use('/', web_routes)

app.listen(3000, () => console.log('server started'))