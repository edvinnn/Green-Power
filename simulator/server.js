if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
require('./simulator')

const app = express()
app.use(express.json())

// Setup routes
const routes = require('./api/routes')
app.use('/api', routes)

app.listen(5000, () => console.log('simulator server started'))
