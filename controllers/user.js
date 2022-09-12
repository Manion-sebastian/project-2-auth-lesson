const express = require('express')
const router = express.Router()

router.get('/new', (req,res) => {
    // render a form to create a new user
    res.send('user form')
})

router.post('/new', async (req,res) => {
    try {
        res.send('posts user')
    } catch(err) {
        console.warn(err)
    }
})

module.exports = router