// required packages
require('dotenv').config()
const express = require('express')
const layout = require('express-ejs-layouts')
const db = require('./models')
// for allowing auth w/ cookies. 
const cookieParser = require('cookie-parser')

// config express middleware
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(layout)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// our custom middleware 
app.use(async (req,res, next) => {
    // console.log('hello there from the middleware 👋🏽')
    // mounts data into middleware and can be accesed from any route.
    res.locals.myData = 'hello fellow route!'
    // move on to the next route or middleware in the chain
    // without next it express wont know what to do and will stay locked in place
    // actual logic 
    // -----
    // if there is a cookie on the incoming request
    if (req.cookies.userId) {
        const user = await db.user.findByPk(req.cookies.userId)
        res.locals.user = null
    } else {
        res.locals.user = null
    }
        // look up the user in the db
        // mount the user on the res.local
    // if there is not user -- set user to be null in the res.locals
    next()
})


// controllers
app.use('/users', require('./controllers/user'))

// routes
app.get('/', (req,res) => {
    console.log('incoming cookie', req.cookies)
    res.render('home')
})


//listen
app.listen(PORT, () => console.log(`Enemy Detected in Sector ${PORT}`))