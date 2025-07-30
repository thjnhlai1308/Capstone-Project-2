import { useEffect, useState } from 'react';
import axios from 'axios';
import ShoeCard from './ShoeCard';
import './style.css';

const Closet = ({ user, getHeaders, favorites, setFavorites }) => {
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await axios.get('/api/favorites/me', getHeaders())
        setFavorites(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load favorites')
      }
    }

    if (user?.id) {
      fetchFavorites()
    }
  }, [user])

  const handleRemove = async (favoriteId) => {
    try {
      await axios.delete(`/api/favorites/${favoriteId}/user/${user.id}`, getHeaders())
      setFavorites(favorites.filter(fav => fav.favorite_id !== favoriteId))
    } catch (err) {
      console.error(err)
      alert('Failed to remove favorite')
    }
  }

  if (!user?.id) {
    return <h2 className="closet-container">Please log in to view your closet.</h2>
  }

  if (error) return <p className="error">{error}</p>
  if (!favorites.length) return <h2 className="closet-container">No favorites yet.</h2>

  return (
    <div className="closet-container">
      <h2>🔥 Your Favorite Kicks</h2>
      <div className="shoe-grid">
        {favorites.map((fav) => (
          <div key={fav.favorite_id} className="shoe-card">
            <img src={fav.image_url} alt={fav.name} className="shoe-image" />
            <div className="shoe-name">{fav.name}</div>
            <div className="shoe-details">Brand: {fav.brand}</div>
            <div className="shoe-details">Model: {fav.model}</div>
            <div className="shoe-details">Color: {fav.color}</div>
            <button
              className="shoe-button"
              onClick={() => handleRemove(fav.favorite_id)}
            >
              Remove Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Closet
