const express = require('express')
    , config = require('./config')
    // , morgan = require('morgan')
    , authRoute = require('./routes/authRoute')
    , salaryRoute = require('./routes/salaryRoute')
    , cors = require('cors')

const app = express()
    , port = config.port || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(morgan('dev'))
app.use(cors())
    
// routes
app.use('/api', authRoute, salaryRoute)
    
// global route
app.get('/', (req, res) => {
    res.send('Welcome')
})
    
// unhandled route
app.all('*', (req, res) => {
    res.send('Are you lost?')
})

app.listen(port, () => console.log(`Running on port: ${port}`))