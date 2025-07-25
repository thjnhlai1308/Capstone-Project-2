const express = require("express")
const app = express.Router()

//define api routes here
app.use('/users', require('./users'))

module.exports = app