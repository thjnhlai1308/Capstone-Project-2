import { useEffect, useState } from 'react';
import axios from 'axios';
import ShoeCard from './ShoeCard'; // reuse your component
import './style.css';

const Closet = ({ getHeaders }) => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('/api/favorites/me', getHeaders());
      setFavorites(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load favorites');
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await axios.delete(`/api/favorites/${favoriteId}`, getHeaders());
      setFavorites(favorites.filter(fav => fav.favorite_id !== favoriteId));
    } catch (err) {
      console.error(err);
      alert('Failed to remove favorite');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (error) return <div>{error}</div>;
  if (!favorites.length) return <h2 className="closet-container">No favorites yet</h2>;

  return (
    <div className="closet-container">
      {favorites.map((shoe) => (
        <div key={shoe.favorite_id} className="shoe-card">
          <img src={shoe.image_url} alt={shoe.name} className="shoe-image" />
          <div className="shoe-name">{shoe.name}</div>
          <div className="shoe-details">Brand: {shoe.brand}</div>
          <div className="shoe-details">Model: {shoe.model}</div>
          <div className="shoe-details">Size: {shoe.size}</div>
          <div className="shoe-details">Color: {shoe.color}</div>
          <button
            className="shoe-button"
            onClick={() => removeFavorite(shoe.favorite_id)}
          >
            Remove Favorite
          </button>
        </div>
      ))}
    </div>
  );
};

export default Closet;
