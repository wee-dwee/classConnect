// JoinClassPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom"; // Removed unnecessary import
import './JoinClassPage.css';
import Footer from './Footer';
import Navbar from './Navbar';

const JoinClassPage = ({username}) => {
  const [classcode, setClasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { profileId } = useParams(); // Added to extract username from URL params

  const handleJoinClass = async () => {
    try {
      const response = await axios.post('http://localhost:3002/join-class', { classcode, profileId });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Failed to join class. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <>
    <Navbar username={username} profileId={profileId} />
      <div className="join-class-container">
      <h2 className="formhead">Join Class</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div>
        <label className="headings">Enter Class Code:</label>
        <input type="text" value={classcode} onChange={(e) => setClasscode(e.target.value)} />
      </div>
      <button onClick={handleJoinClass} className="joinclassbtn">Join Class</button>
    </div>
    <Footer />
    </>
    
  );
};

export default JoinClassPage;
