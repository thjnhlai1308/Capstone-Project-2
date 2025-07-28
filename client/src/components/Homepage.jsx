import { useEffect, useState } from "react";
import axios from "axios";
import ShoeCard from './ShoeCard';
import './style.css';

const Homepage = ({ user, getHeaders, favorites, setFavorites }) => {
  const [shoes, setShoes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const { data } = await axios.get('/api/shoes');
        setShoes(data);
      } catch (err) {
        console.error('Failed to load shoes on homepage:', err);
        setError('Failed to load shoes');
      }
    };
    fetchShoes();
  }, []);

  return (
    <div className="homepage">
      <h1>Welcome to KickMatch</h1>
      <p>Looking for the one? Your next favorite pair is waiting. <br />Explore the closet, match your style, and make it yours.</p>

      <section className="allshoes">
        <h2>Explore All Kicks</h2>
        {error && <p className="error">{error}</p>}
        <div className="shoe-grid">
          {shoes.map(shoe => (
            <ShoeCard key={shoe.id} shoe={shoe} user={user} getHeaders={getHeaders} favorites={favorites} setFavorites={setFavorites} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
