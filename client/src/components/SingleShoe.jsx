import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const SingleShoe = ({user}) => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [shoe, setShoe] = useState(null)
    const [error, setError] = useState('')

    useEffect (() => {
        const fetchShoe = async () => {
            try {
                const {data} = await axios.get(`/api/shoes/${id}`)
                setShoe(data)
            } catch (error) {
                console.error(error)
                setError('Failed to load shoe details.')
            }
        }
        if (user?.id) {
            fetchShoe()
        }
    }, [id, user])

    if (!user?.id) {
        return (
            <div className='login-required'>
                <h2>
                    Login Required
                </h2>
                <p>
                Hold up — this feature’s just for you!
                To add shoes to your closet, mark favorites, and view full details, you’ll need to be logged in. Sign in or create an account to get started.
                </p>
                <div className='auth-buttons'>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </div>
                
            </div>
        )
    }

    if (error) return <p>{error}</p>
    if (!shoe) return <p>Loading...</p>

    return (
        <div className='shoe-page'>
            <button className='back-button' onClick={() => navigate(-1)}> 🔙 Back</button>
            <div className='shoe-container'>
                <div className='shoe-image-container'>
                    <img src={shoe.image_url} alt={shoe.name} className="shoe-image" />
                </div>
                <div className='shoe-info'>
                    <h1>{shoe.name}</h1>
                    <p><strong>Brand:</strong> {shoe.brand}</p>
                    <p><strong>Model:</strong> {shoe.model}</p>
                    <p><strong>Color:</strong> {shoe.color}</p>
                    <p className='shoe-description'>{shoe.description}</p>
                    {shoe.buy_link && (
                        <a href={shoe.buy_link} target="_blank" rel="noopener noreferrer">
                            <button className="buy-now-button">Buy Now</button>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SingleShoe