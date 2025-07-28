import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Navbar = ({ user, logout }) => {
    console.log('Navbar user:', user)

    const isLoggedIn = !!user?.id;

    return (
        <nav className="navbar">
        <h2 className="logo">
            <Link to="/">KickMatch</Link>
        </h2>

        <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>

        {isLoggedIn ? (
          <>
            <Link to="/closet">My Closet</Link>
            <Link to="/aboutme">Account</Link>
            <span className="welcome">Hi, {user.username}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
