const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/new', (req,res) => {
    // render a form to create a new user
    res.render('users/new')
})

router.post('/', async (req,res) => {
    try {
        //create new user
        const newUser = await db.user.create(req.body)
        //store that new users id as a cookie in browser
        res.cookie('userId', newUser.id) 
        res.redirect('/')

    } catch(err) {
        console.warn(err)
    }
})

// GET /users/login -- show a login form to the user

router.get('/login', (req,res) => {
    res.render('users/login')
})

// POST /users/login -- accept a payload of form data and use it to  log a user in

router.post('/login', (req,res) => {
    res.send('log the user in')
})

// GET /users/logout -- log out a user by clearing the cookie

router.get('/logout', (req,res) => {
    res.send('log the user out')
})

module.exports = router