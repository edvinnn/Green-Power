const express = require('express')
const app = express()
const mongoose = require('mongoose')
const simulator = require('./simulator')

app.use(express.json())

// Connect to database
mongoose.connect('mongodb://localhost/GreenPowerDB', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('server connected to database'))

// Setup routes
const routes = require('./api/routes')
app.use('/api', routes)

// Start simulator
simulator.run()

app.listen(3000, () => console.log('server started'))