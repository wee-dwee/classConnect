import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useParams, useHistory } from "react-router-dom";
import Footer from './Footer.js';
import Navbar from './Navbar.js';
import CreateCard from './CreateCard.js';

function Home() {
  const [profile, setProfile] = useState({});
  const location = useLocation();
  const history = useHistory();
  const { profileId } = useParams();
  const createdClasses = [
    { id: 1, title: "Class 1", owner: "owner1@example.com" },
    { id: 2, title: "Class 2", owner: "owner2@example.com" },
    { id: 3, title: "Class 3", owner: "owner3@example.com" },
    { id: 4, title: "Class 4", owner: "owner4@example.com" },
    { id: 5, title: "Class 5", owner: "owner5@example.com" },
    { id: 6, title: "Class 6", owner: "owner6@example.com" },
    { id: 7, title: "Class 7", owner: "owner7@example.com" },
    { id: 8, title: "Class 8", owner: "owner8@example.com" },
    { id: 9, title: "Class 9", owner: "owner9@example.com" }
  ];
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
    <>
      <Navbar username={profile.email} profileId={profileId} />
      <ol className="joined">
            {createdClasses.map((item) => (
              <CreateCard/>
            ))}
          </ ol>
      <Footer/>
    </>
      
  );
}

export default Home;
