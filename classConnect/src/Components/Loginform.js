import React, { useState } from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function Loginform() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/login', {
        username,
        password
      });
      // Handle successful login, e.g., redirect to dashboard
      console.log('Login successful', response.data);
      window.alert('Login successfull.');
      history.push('/home',{username:username});
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login">
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
          <div className="input-box">
            <input
              type="email"
              placeholder='Enter Email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaEnvelope className='icon' />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password ? (
              showPassword ? (
                <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="icon" onClick={togglePasswordVisibility} />
              )
            ) : (
              <FaLock className='icon'/>
            )}
          </div>
          <div className="remember-forgot">
            <Link to='/forgotpassword'>Forgot Password?</Link>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>Don't have an account? <Link to='/register'>Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
