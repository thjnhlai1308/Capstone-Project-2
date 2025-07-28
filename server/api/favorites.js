const express = require('express')
const app = express.Router()
const {
    isLoggedIn
} = require('./middleware')

const {
    createFavorite,
    fetchFavorites,
    deleteFavorite
} = require('../db/favorites')

app.get('/', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await fetchFavorites(req.user.id))
    } catch (error) {
        next(error)
    }
})

app.post('/', isLoggedIn, async (req, res, next) => {
    try {
      const { shoe_id } = req.body;
      const user_id = req.user.id;
  
      if (!shoe_id || !user_id) {
        throw new Error('Missing shoe_id or user_id');
      }
  
      const favorite = await createFavorite({ shoe_id, user_id });
      res.status(201).send(favorite);
    } catch (error) {
      console.error('Error in POST /api/favorites:', error);
      next(error);
    }
  });
  

app.delete('/:fav_id/user/:user_id', isLoggedIn, async (req, res, next) => {
    try {
        await deleteFavorite({id: req.params.fav_id, user_id: req.params.user_id})
        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
})

module.exports = app