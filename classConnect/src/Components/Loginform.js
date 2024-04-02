import React, { useState } from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm({ setUsername, setProfileId }) {
  const [usernameInput, setUsernameInput] = useState('');
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
        username: usernameInput,
        password
      });

      console.log('Login successful', response.data);

      const { user, profileId } = response.data;

      if (!profileId) {
        throw new Error('Profile ID not found in response');
      }

      window.alert('Login successful.');

      // Update username and profile ID in App component state

      setUsername(user.username); // Assuming user object contains username
      setProfileId(profileId);

      history.push(`/home/${profileId}`, { profileId: profileId });
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
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
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
