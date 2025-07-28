import axios from "axios";
import './style.css';

const AboutMe = ({user}) => {
    if (!user.id) {
        return (
            <div className="aboutme-container">
                <h2>Please log in to view your profile.</h2>
            </div>
        )
    }

    return (
        <div className="aboutme-container">
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
            <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>

            {user.is_admin && (
                <p><strong>Adminm Account</strong></p>
            )}

            <hr />

            <h3>Your Shoe Stats</h3>
            <ul>
                <li>Closet Size: {user.shoe_count || 'N/A'}</li>
                <li>Favorites: {user.favorite_count || 'N/A'}</li>
            </ul>
        </div>
    )
}

export default AboutMe
