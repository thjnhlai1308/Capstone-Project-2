import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const Register = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const register = async (formData) => {
        const username = formData.get('username')
        const password = formData.get('password')

        const user = {
            username,
            password
        }
        try {
            const {data} = await axios.post('/api/users/register', user)
            alert('Registration successful! Thank you.')
            navigate('/')
        } catch (error) {
            if (error.response?.status == 500) {
                setError('Invalid username or password')
            } else {
                setError(err.message)
            }
        }
    }
    return (
        <div className="register-container">
            <h1>Register</h1>
            <form action={register}>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <br />
                <label>
                    Username:
                    <input type="text" name="username" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
                <br />
                <button type="submit">Register</button>
                <button className="register-btn" onClick={() => navigate('/login')}>Login</button>
            </form>
            <hr />
            {error && <h2 style={{color: 'red'}}>{error}</h2>}
        </div>
    )
}

export default Register