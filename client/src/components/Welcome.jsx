import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './style.css'

const Welcome = ({user}) => {
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const {data} = await axios.get('/api/shoes/popular')
                setPopularShoes(data)
            } catch (error) {
                console.error('Error fetching popular shoes:', error)
            }
        }
        fetchPopular()
    }, [])

    return (
        <div className="welcome-page">
            <section className="hero">
                <h1>Welcome to <span className="highlight">KickMatch</span></h1>
                <p>
                    Your virtual sneaker closet — match your vibe, track your heat.
                </p>
                <div className="btns">
                    {!user?.id && <button onClick={() => navigate('/register')}>Build Your Collection</button>}
                    <button onClick={() => navigate('/browse')}>Explore Shoes</button>
                </div>
            </section>

            <section className="instructions">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>👟 Find Your Kicks</h3>
                        <p>Discover your next favorite pair and build a virtual closet that reflects your style.</p>
                    </div>
                    <div className="step">
                        <h3>❤️ Favorite Pairs</h3>
                        <p>Save your favorites and keep track of what you love.</p>
                    </div>
                    <div className="step">
                        <h3>🔎 Explore Drops</h3>
                        <p>Browse what's trending and view detailed info and buy links.</p>
                    </div>
                    <div className="step">
                        <h3>💭 Drop your thoughts.</h3>
                        <p>Hype it up or call it out — rate and review your kicks.</p>
                    </div>
                </div>
            </section>

            <section className="final">
                {!user?.id && (
                    <>
                        <h2>Ready to build your closet?</h2>
                        <button onClick={() => navigate('/register')}>Create Account</button>
                    </>
                )}
            </section>
        </div>
    )
}

export default Welcome