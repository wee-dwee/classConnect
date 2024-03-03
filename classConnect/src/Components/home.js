// src/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

function Home() {
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Fetch data from the backend with the username as a query parameter
    axios.get('http://localhost:3002/', {
      params: {
        username: location.state.id,
      },
    })
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [location.state.username]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        <h1>{location.state.id}</h1>
      </header>
    </div>
  );
}

export default Home;
