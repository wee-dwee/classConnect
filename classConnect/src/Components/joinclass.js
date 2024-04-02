// JoinClassPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom"; // Removed unnecessary import
import './JoinClassPage.css'

const JoinClassPage = () => {
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
    <div className="join-class-container">
      <h2>Join Class</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div>
        <label>Class Code:</label>
        <input type="text" value={classcode} onChange={(e) => setClasscode(e.target.value)} />
      </div>
      <button onClick={handleJoinClass}>Join Class</button>
    </div>
  );
};

export default JoinClassPage;
