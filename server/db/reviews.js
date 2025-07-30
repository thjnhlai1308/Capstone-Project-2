const client = require('./client')
const {v4} = require('uuid')
const uuidv4 = v4

const createReview = async ({ user_id, shoe_id, rating, comment, image_urls = [] }) => {
    const SQL = `
        INSERT INTO reviews(id, user_id, shoe_id, rating, comment, image_urls, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), user_id, shoe_id, rating, comment, image_urls])
    return response.rows[0]
  }
  
const updateReview = async ({ review_id, rating, comment, image_urls = [] }) => {
    const SQL = `
        UPDATE reviews
        SET rating = $1, comment = $2, image_urls = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
    `
    const response = await client.query(SQL, [rating, comment, image_urls, review_id])
    return response.rows[0]
  }
const fetchReviewsByShoe = async (shoe_id) => {
    const SQL = `
        SELECT r.*, u.username
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE shoe_id = $1
        ORDER BY created_at DESC
    `
    const response = await client.query(SQL, [shoe_id])
    return response.rows
  }
  
const fetchReviewsByUser = async (user_id) => {
    const SQL = `
        SELECT r.*, s.name AS shoe_name
        FROM reviews r
        JOIN shoes s ON r.shoe_id = s.id
        WHERE user_id = $1
        ORDER BY created_at DESC
    `
    const response = await client.query(SQL, [user_id])
    return response.rows
  }
  
const deleteReview = async (review_id) => {
    const SQL = `
        DELETE FROM reviews
        WHERE id = $1
        RETURNING *
    `
    const response = await client.query(SQL, [review_id])
    return response.rows[0]
  }
  
  const getAverageRating = async (shoe_id) => {
    const SQL = `
      SELECT ROUND(AVG(rating), 1) AS average_rating
      FROM reviews
      WHERE shoe_id = $1
    `
    const response = await client.query(SQL, [shoe_id]);
    const avg = response.rows[0]?.average_rating;
    return avg === null ? null : parseFloat(avg);
  };
  
module.exports = {
    createReview,
    updateReview,
    fetchReviewsByShoe,
    fetchReviewsByUser,
    deleteReview,
    getAverageRating
}
  