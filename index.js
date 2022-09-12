// required packages
require('dotenv').config()
const express = require('express')
const layout = require('express-ejs-layouts')

// config express middleware
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(layout)

// routes
app.get('/', (req,res) => {
    res.send('hello, user Auth')
})

//listen
app.listen(PORT, () => console.log(`Enemy Detected in Sector ${PORT}`))