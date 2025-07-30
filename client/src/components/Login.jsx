import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = ({ attemptLoginWithToken }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

  const login = async (formData) => {
    const username = formData.get('username');
    const password = formData.get('password');
    const user = { username, password };

    try {
      setError('');
      const { data } = await axios.post('/api/auth/login', user);
      const { token } = data;
      window.localStorage.setItem('token', token);
      attemptLoginWithToken();
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError('Incorrect credentials');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h1 className="login-title">Login</h1>
      <form action={login} className="login-form">
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit" className="login-button">Login</button>
        <button className="register-btn" onClick={() => navigate('/register')}>Register</button>
      </form>

      <br />

      

      <div className="oauth-section">
        <a className="github-login" href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}>
          Login through GitHub
        </a>
      </div>
      
      <hr />
        {error && <h2>{error}</h2>}
    </div>
  );
};

export default Login;
