import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './style.css'

const SingleShoe = ({ user, getHeaders, favorites = [], setFavorites }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [shoe, setShoe] = useState(null)
    const [error, setError] = useState('')
    const [averageRating, setAverageRating] = useState(null)
    const [reviews, setReviews] = useState([])
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')

    const favoriteEntry = favorites.find(fav => fav.shoe_id === id)
    const isFavorited = Boolean(favoriteEntry)

    useEffect(() => {
        const fetchShoe = async () => {
            try {
                const { data } = await axios.get(`/api/shoes/${id}`)
                console.log('Fetched shoe:', data)
                setShoe(data)
            } catch (error) {
                console.error(error)
                setError('Failed to load shoe details.')
            }
        }

        const fetchReviews = async () => {
            const { data } = await axios.get(`/api/reviews/shoe/${id}`)
            setReviews(data)
        }

        const fetchAverageRating = async () => {
            const { data } = await axios.get(`/api/reviews/average/${id}`)
            setAverageRating(data.average_rating)
        }

        if (user?.id) {
            fetchShoe()
            fetchReviews()
            fetchAverageRating()
        }
    }, [id, user])

    const toggleFavorite = async () => {
        if (!user?.id) return alert('Please log in to manage favorites')

        try {
            if (isFavorited) {
            await axios.delete(`/api/favorites/${favoriteEntry.id}`, getHeaders())
            setFavorites(favorites.filter(f => f.id !== favoriteEntry.id))
        } else {
            const { data } = await axios.post('/api/favorites', { shoe_id: id }, getHeaders())
            setFavorites([...favorites, data])
        }
    } catch (err) {
        console.error('Favorite toggle failed:', err)
    }
}

    const submitReview = async () => {
        try {
            await axios.post('/api/reviews', {
            shoe_id: id,
            rating,
            comment
        }, getHeaders())

        setComment('')
        setRating(5)
        setShowReviewForm(false)

        const { data: updatedReviews } = await axios.get(`/api/reviews/shoe/${id}`)
        setReviews(updatedReviews)

        const { data: avg } = await axios.get(`/api/reviews/average/${id}`)
        setAverageRating(avg.average_rating)
        } catch (err) {
            console.error(err)
        }
    }

    if (!user?.id) {
        return (
            <div className='login-required'>
                <h2>Login Required</h2>
                <p>
                    Hold up — this feature’s just for you!<br />
                    To add shoes to your closet, mark favorites, and view full details, you’ll need to be logged in.
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
                    <p>
                        <strong>Average Rating:</strong>{' '}
                        {typeof averageRating === 'number'  ? `${averageRating.toFixed(1)} ⭐`: 'No ratings yet'}
                    </p>

                </div>
            </div>

            <div className="single-shoe-actions">
                <button className={`shoe-button ${isFavorited ? 'favorited' : ''}`} onClick={toggleFavorite}>
                    {isFavorited ? 'Favorited ❤️' : 'Add to Favorite'}
                </button>
                <button className="review-button" onClick={() => setShowReviewForm(!showReviewForm)}>
                    {showReviewForm ? 'Cancel Review' : 'Add a Review'}
                </button>
            </div>

            {showReviewForm && (
                <div className="review-form">
                    <h3>Write a Review</h3>
                    <label>
                        Rating:
                        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Comment:
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                    </label>
                    <button onClick={submitReview}>Submit Review</button>
                </div>
            )}

            <div className="reviews-section">
                <h3>Recent Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <p><strong>Rating:</strong> {review.rating} ⭐</p>
                            <p><strong>Comment:</strong> {review.comment}</p>
                            <p><small>By User {review.user_id}</small></p>
                        </div>
                    ))
                )}
            </div>

            <div className="back-links">
                <Link to="/browse" className="view-link">← Back to Browse</Link>
                <Link to="/closet" className="view-link">👟 My Closet</Link>
            </div>
        </div>
    )
}

export default SingleShoe
