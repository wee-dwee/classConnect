import React, { useState } from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import axios from 'axios';
import { Link , useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Forgotpassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mailOTP,setMailOTP] = useState('');
  const [stage, setStage] = useState(0); 
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setcShowPassword] = useState(false);
  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setcShowPassword(!showcPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (stage == 0) {
      try {
        setError(null);
        const response = await axios.post('http://localhost:3002/api/send-otp', { username });
        const { message, otp } = response.data;
        
        if (message) {
        alert(message); // Display the message
        setMailOTP(otp);
        
        setStage(1);
      } else {
        console.error('Error sending OTP:', response.data.error);
      }
      } catch (error) {
        setError('Invalid email. Please try again.');
        console.error('Error sending OTP:', error);
      }
    }else if (stage === 1) {
      try {
        setError(null);
        const response = await axios.post('http://localhost:3002/api/verify-otp', { otp, mailOTP: mailOTP.toString()});
        if (response.data.success) {
          setStage(2);
        } else {
          setError('Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
      }
    } else if (stage === 2) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        setError(null);
        const response = await axios.post('http://localhost:3002/api/update-password', {
          username,
          newPassword
        });
        alert("Password Updated Successfully!"); 
        setUsername('');
        history.push('/');
        // Handle success, maybe redirect user or show a success message
      } catch (error) {
        setError("Password not updated. PLease try again!");
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
                {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
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
              {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
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
              {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
              <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {newPassword ? (
              showPassword ? (
                <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="icon" onClick={togglePasswordVisibility} />
              )
            ) : (
              <FaLock className='icon'/>
            )}
          </div>
          <div className="input-box">
            <input
              type={showcPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword ? (
              showcPassword ? (
                <FaEyeSlash className="icon" onClick={togglePasswordVisibility1} />
              ) : (
                <FaEye className="icon" onClick={togglePasswordVisibility1} />
              )
            ) : (
              <FaLock className='icon'/>
            )}
          </div>
            </>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}