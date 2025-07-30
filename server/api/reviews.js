const express = require('express')
const app = express.Router()
const {
    createReview,
    updateReview,
    fetchReviewsByShoe,
    fetchReviewsByUser,
    deleteReview,
    getAverageRating
} = require('../db/reviews')

const { isLoggedIn } = require('./middleware')


app.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const { shoe_id, rating, comment, image_urls } = req.body
        const review = await createReview({
            user_id: req.user.id,
            shoe_id,
            rating,
            comment,
            image_urls: image_urls || []
        })
        res.status(201).send(review)
    } catch (err) {
        next(err)
    }
})


app.get('/shoe/:shoeId', async (req, res, next) => {
    try {
        const reviews = await fetchReviewsByShoe(req.params.shoeId)
        res.send(reviews)
    } catch (err) {
        next(err)
    }
})


app.get('/user', isLoggedIn, async (req, res, next) => {
    try {
        const reviews = await fetchReviewsByUser(req.user.id)
        res.send(reviews)
    } catch (err) {
        next(err)
    }
})


app.put('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { rating, comment, image_urls } = req.body
        const updated = await updateReview({
            review_id: req.params.id,
            rating,
            comment,
            image_urls: image_urls || []
        })
        res.send(updated)
    } catch (err) {
        next(err)
    }
})


app.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const deleted = await deleteReview(req.params.id)
        res.send(deleted)
    } catch (err) {
        next(err)
    }
})


app.get('/average/:shoeId', async (req, res, next) => {
    try {
        const average = await getAverageRating(req.params.shoeId)
        res.send({ average_rating: average })
    } catch (err) {
        next(err)
    }
})

module.exports = app
