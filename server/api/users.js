const express = require('express')
const app = express.Router()

app.get('/', async(req,res,next)=> {
    try {
        res.send("inside of GET /api/users route!")
    } catch (error) {
        next(error)
    }
})


module.exports = app