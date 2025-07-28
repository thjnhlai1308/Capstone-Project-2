import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './components/style.css';

import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import Closet from './components/Closet';
import AboutMe from './components/Aboutme';
import SingleShoe from './components/SingleShoe';
import Browse from './components/Browse';

function App() {
  const [user, setUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const getHeaders = () => ({
    headers: {
      authorization: window.localStorage.getItem('token'),
    },
  })

  const attempLoginWithToken = async () => {
    const token = window.localStorage.getItem('token')
    console.log('Token being sent:', token)
    if(token){
      try {
        const {data} = await axios.get('/api/auth/me', getHeaders())
        setUser(data)
      } catch (error) {
        console.log(error)
        window.localStorage.removeItem('token')
      }
    }
  }

  const logout = () => {
    window.localStorage.removeItem('token');
    setUser({});
    navigate('/');
  };

  useEffect(() => {
    attempLoginWithToken();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user.id) {
        try {
          const { data } = await axios.get('/api/favorites', getHeaders());
          setFavorites(data);
        } catch (err) {
          console.error('Failed to fetch favorites', err);
        }
      } else {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  return (
    <>
      <Navbar user={user} logout={logout} />

      <Routes>
        <Route path="/" element={<Homepage user={user} getHeaders={getHeaders} favorites={favorites} setFavorites={setFavorites} />} />
        <Route path='/browse' element={<Browse user={user} getHeaders={getHeaders} favorites={favorites} setFavorites={setFavorites} />} />
        <Route path="/login" element={<Login attemptLoginWithToken={attempLoginWithToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/closet" element={<Closet user={user} getHeaders={getHeaders} />} />
        <Route path="/shoes/:id" element={<SingleShoe user={user}/>} />
        <Route
          path="/aboutme"
          element={
            user.id ? (
              <AboutMe
                user={user}
                favorites={favorites}
                getHeaders={getHeaders}
                setFavorites={setFavorites}
              />
            ) : (
              <Login attemptLoginWithToken={attempLoginWithToken} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
