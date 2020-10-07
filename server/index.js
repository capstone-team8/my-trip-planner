const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')

// Enable CORS requests
app.use(cors())

// Configure bodyParser & cookieParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// Configure routers
app.use('/api/hello', require('./routes/hello'))
app.use('/api/user', require('./routes/user'))
app.use('/api/location', require('./routes/location'))
app.use('/api/plan', require('./routes/plan'))

// Start the app
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})
