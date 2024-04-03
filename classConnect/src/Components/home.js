import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useParams, useHistory } from "react-router-dom";
import Footer from './Footer.js';
import Navbar from './Navbar.js';
import CreateCard from './CreateCard.js';

function Home() {
  const [profile, setProfile] = useState({});
  const [createdClasses, setCreatedClasses] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const { profileId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3002/show-classes/instructor/${profileId}`)
      .then(response => {
        console.log(profileId);
        setProfile(response.data); // Assuming response.data is an object containing profile information
        setCreatedClasses(response.data.classes); // Assuming response.data.classes is an array of classes
        console.log(createdClasses);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [profileId]);

  return (
    <>
      <Navbar username={profile.email} profileId={profileId} />
      <ol className="joined">
        {createdClasses.map((classItem) => (
          <CreateCard keyname={classItem.name} title={classItem.name} classcode={classItem.classcode} />
        ))}
      </ol>
      <Footer />
    </>
  );
}

export default Home;
