import { useEffect, useState } from 'react';
import axios from 'axios';
import ShoeCard from './ShoeCard';
import './style.css';

const Browse = ({ user, getHeaders, favorites, setFavorites }) => {
  const [shoes, setShoes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const { data } = await axios.get('/api/shoes')
        setShoes(data)
      } catch (err) {
        console.error('Error loading shoes:', err)
        setError('Unable to load shoes at this time.')
      }
    };

    fetchShoes()
  }, [])

  return (
    <div className="browse-page">
      <h1>👟 Explore All Kicks</h1>
      <p>Browse trending styles and build your virtual closet.</p>

      {!user?.id && (
        <div className="login-required-banner">
          <p><strong>Note:</strong> You must be logged in to add favorites.</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="shoe-grid">
        {shoes.map((shoe) => (
          <ShoeCard
            key={shoe.id}
            shoe={shoe}
            user={user}
            getHeaders={getHeaders}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        ))}
      </div>
    </div>
  )
}

export default Browse
