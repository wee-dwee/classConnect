import './Profile.css';
import { useLocation, useParams } from 'react-router-dom'; // Added useParams
import Navbar from './Navbar';
import Footer1 from './Footer1';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { username } = useParams(); // Added to extract username from URL params
  const image = ''
  useEffect(() => {
    // Fetch data from the backend with the username as a query parameter
    axios.get(`http://localhost:3002/profiles/${username}`)
      .then(response => {
        setProfile(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setIsLoading(false);
      });
  }, [username]); // Updated to use username from URL params

  const handleImageClick = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };

  return (
    <>
      <Navbar />
      <div className="create-box">
        <div className='upc'>
          <div className="gradient"></div>
          <div className="profile-down">
            {isLoading ? (
              <p>Loading profile...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              <>
                <img 
                  src="https://source.unsplash.com/random"
                  alt="No image" 
                  onClick={handleImageClick} 
                  className={isImageEnlarged ? "enlarged-image" : ""}
                />
                <div className="profile-title">{profile.name}</div>
                <div className="profile-email">{profile.email}</div>
                <div className="profile-description">
                  {profile.bio}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}
