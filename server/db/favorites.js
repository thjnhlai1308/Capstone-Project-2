const client = require('./client')
const {v4} = require('uuid')
const uuidv4 = v4

const createFavorite = async (favorite) => {
    const SQL = `
        INSERT INTO favorites(id, shoe_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), favorite.shoe_id, favorite.user_id])
    return response.rows[0]
}

const fetchFavorites = async (userId) => {
    const SQL = `
        SELECT f.id AS favorite_id, s.*
        FROM favorites f
        JOIN shoes s ON f.shoe_id = s.id
        WHERE f.user_id = $1
    `
    const response = await client.query(SQL, [userId])
    return response.rows
}

const deleteFavorite = async (favorite) => {
    const SQL = `
        DELETE from favorites
        WHERE id = $1 and user_id = $2
    `
    await client.query(SQL, [favorite.id, favorite.user_id])
}

module.exports = {
    createFavorite,
    fetchFavorites,
    deleteFavorite
}