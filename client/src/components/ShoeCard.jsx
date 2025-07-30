import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

const ShoeCard = ({ shoe, getHeaders, user, favorites, setFavorites }) => {
  const { id, name, brand, model, size, color, image_url } = shoe

  const favoriteEntry = favorites.find(fav =>
    fav.shoe_id === id || fav.id === id || fav.id === shoe.id
  )
  const isFavorited = Boolean(favoriteEntry)

  const toggleFavorite = async () => {
    if (!user || !user.id) {
      alert('Please log in to manage favorites')
      return
    }
  
    try {
      if (isFavorited) {
        await axios.delete(`/api/favorites/${favoriteEntry.id}`, getHeaders())
        setFavorites(favorites.filter(fav => fav.id !== favoriteEntry.id))
      } else {
        const { data } = await axios.post('/api/favorites', {shoe_id: id, user_id: user.id,}, getHeaders())
        setFavorites([...favorites, data])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }
  

  return (
    <div className="shoe-card">
      <img src={image_url} alt={name} className="shoe-image" />
      <div className="shoe-name">{name}</div>
      <div className="shoe-details">Brand: {brand}</div>
      <div className="shoe-details">Model: {model}</div>
      <div className="shoe-details">Color: {color}</div>

      <button
        className={`shoe-button ${isFavorited ? 'favorited' : ''}`}
        onClick={toggleFavorite}
      >
        {isFavorited ? 'Favorited ❤️' : 'Add to Favorite'}
      </button>
      <Link to={`/shoes/${shoe.id}`} className="view-link">
          View Details
      </Link>
    </div>
  )
}


export default ShoeCard
