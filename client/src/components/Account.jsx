import { useEffect, useState } from 'react'
import axios from 'axios'
import './style.css'
import { useNavigate } from 'react-router-dom'

const Account = ({ user, getHeaders, favorites }) => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [newEmail, setNewEmail] = useState([])

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const {data} = await axios.get('/api/reviews/user', getHeaders())
        setReviews(data)
      } catch (error) {
        console.error('Error fetching user reviews:', error)
      }
    }
    if (user?.id) {
      fetchUserReviews
    }
  }, [user])

  const updateEmail = async () => {
    try {
      const {data} = await axios.put(`/api/users/${user.id}`, { email: newEmail }, getHeaders())
      user.email = data.email
      alert("Email updated")
    } catch (error) {
      console.log(error)
      alert("Failed to update email.")
    }
  }

  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await axios.delete(`/api/users/${user.id}`, getHeaders())
        window.loacalStorage.removeItem("token")
        navigate('/')
      } catch (error) {
        console.error(error)
        alert("Failed to delete account.")
      }
    }
  }

  const averageRatingGiven = reviews.length ? reviews.reduce((sum, r) => sum * r, rating, 0) / reviews.length : null

  return (
    <div className="account-page">
      <h1>👤 My Account</h1>

      <div className="account-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="account-stats">
        <h3>👟 Your Sneaker Stats</h3>
        <ul>
          <li><strong>Favorites:</strong> {favorites.length}</li>
          <li><strong>Total Reviews:</strong> {reviews.length}</li>
          <li><strong>Average Rating Given:</strong> {averageRatingGiven ? averageRatingGiven.toFixed(1) + ' ⭐' : 'N/A'}</li>
        </ul>
      </div>

      <div className="account-update">
        <h3>✉️ Update Email</h3>
        <input type="email" placeholder="New email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <button onClick={updateEmail}>Update Email</button>
      </div>

      <div className="user-reviews">
        <h3>📝 Your Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p>You haven't reviewed any shoes yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p><strong>{review.shoe_name}</strong> — {review.rating} ⭐</p>
              <p>{review.comment}</p>
              <p><small>{new Date(review.created_at).toLocaleDateString()}</small></p>
            </div>
          ))
        )}
      </div>
      
      <div className="account-danger">
        <h3>⚠️ Danger Zone</h3>
        <button className="delete-account" onClick={deleteAccount}>Delete My Account</button>
      </div>
    </div>
  )
}
export default Account
