// required packages
require('dotenv').config()
const express = require('express')
const layout = require('express-ejs-layouts')
const db = require('./models')
// for allowing auth w/ cookies. 
const cookieParser = require('cookie-parser')
const crypto = require('crypto-js')

// config express middleware
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(layout)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// our custom auth middleware
app.use(async (req, res, next) => {
    // console.log('hello from a middleware 👋')
    // if there is a cookie on the incoming request
    if (req.cookies.userId) {
        // decrypt the user id before we look up the user in the db
        const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
        // look up the user in the db
        const user = await db.user.findByPk(decryptedIdString)
        // mount the user on the res.locals
        res.locals.user = user
    // if there is no cookie -- set the user to be null in the res.locals
    } else {
        res.locals.user = null
    }
    // move on to the next route or middleware in the chain
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