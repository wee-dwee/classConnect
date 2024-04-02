import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useParams, useHistory } from "react-router-dom";
import Footer from './Footer.js';
import Navbar from './Navbar.js';

function Home() {
  const [profile, setProfile] = useState({});
  const location = useLocation();
  const history = useHistory();
  const { profileId } = useParams();
  useEffect(() => {
    // Fetch data from the backend with the username as a query parameter
    axios.get(`http://localhost:3002/profiles/${profileId}`)
      .then(response => {
        console.log(profileId);
        setProfile(response.data); // Assuming response.data is an object
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [profile.name]);

  return (
    <div className="App">
      <Navbar username={profile.email} profileId={profileId} />
      <div className="create-box">
        <header className="App-header">
          <h1>Name: {profile.name}</h1>
          <p>Email: {profile.email}</p>
          <p>Bio: {profile.bio}</p>
          {profile.isInstructor ? <p>IsInstructor: Yes</p> : null}
        </header>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;
