// src/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Footer from './Footer.js';
import Navbar from './Navbar.js';
function Home() {
  const [profile, setProfile] = useState({});
  const location = useLocation();

  useEffect(() => {
    // Fetch data from the backend with the username as a query parameter
    axios.get(`http://localhost:3002/profiles/${location.state.username}`)
      .then(response => {
        setProfile(response.data); // Assuming response.data is an object
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [location.state.username]);

  return (
    <div className="App">
      <Navbar />
      <div className="create-box">
      <header className="App-header">
        <h1>Name: {profile.name}</h1>
        <p>Email: {profile.email}</p>
        <p>Bio: {profile.bio}</p>
        <p>Image: {profile.image}</p>
      </header>
      </div>
      
      <Footer/>
    </div>
    
  );
}

export default Home;
