if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')
const express = require('express')
require('./simulator')

const app = express()
app.use(express.json())

// Connect to database
mongoose.connect(process.env.SIMULATOR_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('simulator/server connected to database'))

// Setup routes
const routes = require('./api/routes')
app.use('/api', routes)

app.listen(5000, () => console.log('simulator server started'))
