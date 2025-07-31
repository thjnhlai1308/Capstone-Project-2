const client = require('./client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: __dirname + '/../.env' })
const axios = require('axios')
const {v4} = require('uuid')
const uuidv4 = v4

const findUserByToken = async (token) => {
    try {
        const payload = await jwt.verify(token, process.env.JWT)
        const SQL = `
            SELECT id, username, email, created_at, is_admin
            FROM users
            WHERE id = $1
        `
        const response = await client.query(SQL, [payload.id])
        if(!response.rows.length){
            const error = Error('bad credentials')
            error.status = 401
            throw error
        }
        return response.rows[0]
    } catch (error) {
        console.log(error)
        const er = Error('bad token')
        er.status = 401
        throw er
    }
}

const authenticate = async (credentials) => {
    const SQL = `
        SELECT id, password
        FROM users
        WHERE username = $1
    `
    const response = await client.query(SQL, [credentials.username])
    if(!response.rows.length){
        const error = Error('incorrect username')
        error.status = 401
        throw error
    }
    const valid = await bcrypt.compare(credentials.password, response.rows[0].password)
    if(!valid){
        const error = Error('incorrect password')
        error.status = 401
        throw error
    }
    const token = await jwt.sign({id: response.rows[0].id}, process.env.JWT)
    return {token}
}

const authenticateGithub = async (code) => {
    let response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        code,
        client_secret: process.env.GITHUB_CLIENT_SECRET
    }, {
        headers:{
            Accept: 'application/json'
        }
    })
    
    response = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${response.data.access_token}`
        }
    })
    
    const login = response.data.login
    let SQL = `
        SELECT id
        FROM users
        WHERE username = $1
    `
    response = await client.query(SQL, [login])
    if(!response.rows.length){
        SQL = `
            INSERT INTO users(id, username, is_Oauth)
            VALUES($1, $2, $3)
            RETURNING *
        `
        response = await client.query(SQL, [uuidv4(), login, true])
    }
    return jwt.sign({id:response.rows[0].id}, process.env.JWT)
}

module.exports = {
    findUserByToken,
    authenticate,
    authenticateGithub
}