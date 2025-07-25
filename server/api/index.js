const express = require("express")
const app = express.Router()

//define api routes here
app.use('/users', require('./users'))
app.use('/shoes', require('./shoes'))
app.use('/favorites', require('./favorites'))
app.use('/auth', require('./auth'))

module.exports = app