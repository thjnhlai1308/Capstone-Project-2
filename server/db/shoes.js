const client = require('./client')
const {v4} = require('uuid')
const uuidv4 = v4

const createShoe = async (shoe) => {
    const SQL = `
        INSERT INTO shoes(id, name)
        VALUES($1, $2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), shoe.name])
    return response.rows[0]
}

const fetchShoes = async () => {
    const SQL = `
        SELECT *
        FROM shoes
    `
    const response = await client.query(SQL)
    return response.rows
}

const updateShoe = async (shoe) => {
    const SQL = `
        UPDATE shoes
        SET name = $1
        WHERE id = $2
        RETURNING *
    `
    const response = await client.query(SQL, [shoe.name, shoe.id])
    return response.rows[0]
}

module.exports = {
    createShoe,
    fetchShoes,
    updateShoe
}