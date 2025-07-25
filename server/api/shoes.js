const express = require('express')
const app = express.Router()
const {
    fetchShoes,
    createShoe,
    updateShoe
} = require('../db/shoes')

const {
    isAdmin,
    isLoggedIn
} = require('./middleware')

app.get('/', async (req, res, next) => {
    try {
        res.send(await fetchShoes())
    } catch (error) {
        next(error)
    }
})

app.post('/', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        res.send(await createShoe(req.body))
    } catch (error) {
        next(error)
    }
})

app.put('/:id', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        res.send(await updateShoe({id: req.params.id, ...req.body}))
    } catch (error) {
        next(error)
    }
})

module.exports = app