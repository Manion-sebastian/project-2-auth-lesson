const express = require('express')
const router = express.Router()

router.get('/new', (req,res) => {
    // render a form to create a new user
    res.render('users/new')
})

router.post('/', async (req,res) => {
    try {
        console.log(req.body)
        res.send('posts user')
    } catch(err) {
        console.warn(err)
    }
})

module.exports = router