const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

router.get('/new', (req,res) => {
    // render a form to create a new user
    res.render('users/new')
})

router.post('/', async (req,res) => {
    try {
        // hash the password from the req.body
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        //create new user
        const [newUser, created] = await db.user.findOrCreate({
            email: req.body.email,
            password: hashedPassword
        })
        //store that new users id as a cookie in browser
        const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        res.cookie('userId', encryptedUserIdString)
        res.redirect('./users/profile')

    } catch(err) {
        console.warn(err)
    }
})

// GET /users/login -- show a login form to the user

router.get('/login', (req,res) => {
    res.render('users/login', 
    {message: req.query.message ? req.query.message : null})
})

// POST /users/login -- accept a payload of form data and use it to  log a user in

router.post('/login', async (req,res) => {
    try {
        // look up user in db using supplied email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const noLoginMessage = 'Incorrect username or password'
        if (!user){
            console.log('user not found') 
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is not found -- send them back to login page
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('wrong password')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is fround the the supplied password is wrong return to login page.
        } else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }
    } catch(err) {
        console.log(err)
        res.send('server error')
    }
})

// GET /users/logout -- log out a user by clearing the cookie

router.get('/logout', (req,res) => {
    res.clearCookie('userId')
    res.redirect('/')
})

router.get('/profile', (req,res) => {
    // if user is not logged in redirect 
    if (!res.locals.user){
        res.redirect ('/users/login?message=You must authorize before you are authroized to view this resource')
    } else {
        res.render('./users/profile', {
            user: res.locals.user
        })
    }
})

module.exports = router