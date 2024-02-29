import React, { useState } from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Forgotpassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState(0); // 0: initial, 1: OTP entered, 2: New password entered
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stage == 0) {
      try {
        axios.post('http://localhost:3002/api/send-otp', { username });
        setStage(1);
        setUsername('');
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    }else if (stage === 1) {
      try {
        const response = await axios.post('http://localhost:3002/api/verify-otp', { username, otp });
        if (response.data.success) {
          setStage(2);
        } else {
          alert("Invalid OTP");
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
      }
    } else if (stage === 2) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await axios.post('http://localhost:3002/api/update-password', {
          username,
          newPassword
        });
        console.log(response.data);
        // Handle success, maybe redirect user or show a success message
      } catch (error) {
        console.error('Error updating password:', error);
        // Handle error, show an error message to the user
      }
    }
  };

  return (
    <div className="login">
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          {stage===0 && (
              <>
                <h1>Forgot Password?</h1>
          <div className="input-box">
            <input 
              type="email" 
              placeholder='Enter Email' 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className='icon'/>
          </div>
              </>
          )}
          
          
          {stage === 1 && (
            <>
              <h1>Enter OTP</h1>
            <div className="input-box">
              <input 
                type="text" 
                placeholder='Enter OTP' 
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            </>
            
          )}
          {stage === 2 && (
            <>
              <h1>Change Password</h1>
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
            </>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}