const express = require('express')
const app = express.Router()

const {
    createUser,
    fetchUsers,
    updateUserEmail
} = require('../db/user')

const {
    isAdmin,
    isLoggedIn
} = require('./middleware')

app.get('/', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await fetchUsers())
    } catch (error) {
        next(error)
    }
})

app.post('/register', async (req, res, next) => {
    try {
        res.send(await createUser(req.body))
    } catch (error) {
        next(error)
    }
})

app.put('/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const { userId } = req.params
        const { email } = req.body

        if (req.user.id !== userId) {
            return res.status(403).send({ error: 'Unauthorized' })
        }

        const updatedUser = await updateUserEmail(userId, email)
        res.send(updatedUser)
    } catch (err) {
        next(err)
    }
})

module.exports = app
