import React, { useState } from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [name,setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age,setAge] = useState('');
  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/register', {
        name,
        age,
        username,
        password
      });
      // Handle successful registration
      console.log('Registration successful', response.data);
      window.alert('Registration successful');
      history.push('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="login">
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
          <div className="input-box">
            <input
              type="text"
              placeholder='Enter Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FaEnvelope className='icon'/>
          </div>
          <div className="input-box">
            <input
              type="integer"
              placeholder='Enter Age'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <FaEnvelope className='icon'/>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder='Enter Email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaEnvelope className='icon'/>
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
          <button type="submit">Register</button>
          <div className="register-link">
            <p>Already have an account? <Link to='/'>Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
