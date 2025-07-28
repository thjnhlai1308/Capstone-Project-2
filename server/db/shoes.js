const client = require('./client')
const {v4} = require('uuid')
const uuidv4 = v4

const createShoe = async ({ name, brand, model, color, image_url, description, buy_link, user_id }) => {
    const SQL = `
      INSERT INTO shoes (id, name, brand, model, color, image_url, description, buy_link, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const response = await client.query(SQL, [
      uuidv4(),
      name,
      brand,
      model,
      color,
      image_url,
      description,
      buy_link,
      user_id
    ]);
    return response.rows[0];
  };

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

const getShoeById = async (id) => {
    const SQL = `
      SELECT *
      FROM shoes
      WHERE id = $1
    `;
    const response = await client.query(SQL, [id]);
    return response.rows[0];
  };

module.exports = {
    createShoe,
    fetchShoes,
    updateShoe,
    getShoeById
}