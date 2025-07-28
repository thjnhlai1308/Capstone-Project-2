import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = ({ attemptLoginWithToken }) => {
  const navigate = useNavigate()
  const [err, setError] = useState('')

  const login = async (formData) => {
        const username = formData.get('username')
        const password = formData.get('password')
        const user = {
            username,
            password
        }
        try {
            setError('')
            const {data} = await axios.post('/api/auth/login', user)
            const {token} = data
            window.localStorage.setItem('token', data.token);
            attemptLoginWithToken()
            navigate('/')
        } catch (error) {
            console.error(error)
            if(error.status === 401) {
                setError('incorrect credentials')
            } else {
                setError(error.message)
            }
        }
    }
    return (
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form" action={login}>
                <label>
                    Username:
                    <input type="text" name="username" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;
