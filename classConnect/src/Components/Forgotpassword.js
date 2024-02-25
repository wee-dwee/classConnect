import React, { useState } from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Forgotpassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Make sure new password and confirm password match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Make the POST request to your server endpoint
      const response = await axios.post('http://localhost:3002/api/update-password', {
        username: username,
        newPassword: newPassword
      });
      console.log(response.data); // Assuming server responds with some data
      // Handle success, maybe redirect user or show a success message
    } catch (error) {
      console.error('Error updating password:', error);
      // Handle error, show an error message to the user
    }
  };

  return (
    <div className="login">
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password?</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder='Username' 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className='icon'/>
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder='Enter New Password' 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FaLock className='icon'/>
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder='Confirm Password' 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FaLock className='icon'/>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}
