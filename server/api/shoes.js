const express = require('express')
const app = express.Router()
const {
    fetchShoes,
    createShoe,
    updateShoe,
    getShoeById
} = require('../db/shoes')

const {
    isAdmin,
    isLoggedIn
} = require('./middleware')

app.get('/', async (req, res, next) => {
    try {
        res.send(await fetchShoes())
    } catch (error) {
        next(error)
    }
})

app.post('/', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        res.send(await createShoe(req.body))
    } catch (error) {
        next(error)
    }
})

app.put('/:id', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        res.send(await updateShoe({id: req.params.id, ...req.body}))
    } catch (error) {
        next(error)
    }
})

app.get('/:id', async (req, res, next) => {
    try {
      const shoe = await getShoeById(req.params.id);
      if (!shoe) {
        return res.status(404).send({ error: 'Shoe not found' });
      }
      res.send(shoe);
    } catch (err) {
      console.error('Error fetching shoe by ID:', err);
      next(err);
    }
  });

module.exports = app