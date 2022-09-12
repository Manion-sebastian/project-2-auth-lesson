// required packages
require('dotenv').config()
const express = require('express')
const layout = require('express-ejs-layouts')

// config express middleware
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(layout)
app.use(express.urlencoded({extended:false}))


// controllers
app.use('/users', require('./controllers/user'))

// routes
app.get('/', (req,res) => {
    res.render('home')
})


//listen
app.listen(PORT, () => console.log(`Enemy Detected in Sector ${PORT}`))