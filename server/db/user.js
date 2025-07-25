const client = require('./client')
const bcrypt = require('bcrypt')
const {v4} = require('uuid')
const uuidv4 = v4

const createUser = async (user) => {
    if(!user.username.trim() || !user.password.trim()){
        throw Error('must have username and password')
    }
    user.password = await bcrypt.hash(user.password, 5)
    user.is_admin ? user.is_admin = user.is_admin : user.is_admin = false
    const SQL = `
        INSERT INTO users(id, username, password, is_admin)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `
    const response = await client.query (SQL, [uuidv4(), user.username, user.password, user.is_admin])
    return response.rows[0]
}

const fetchUsers = async () => {
    const SQL = `
        select *
        FROM users
    `
    const response = await client.query(SQL)
    return response.rows
}

module.exports = {
    createUser,
    fetchUsers
}