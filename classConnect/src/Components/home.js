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
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/show-classes/${profileId}`);
        setProfile(response.data.profile); // Assuming response.data.profile is an object containing profile information
        setCreatedClasses(response.data.classes); // Assuming response.data.classes is an array of classes
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [profileId]);

  return (
    <>
      <Navbar username={profile.email} profileId={profileId} />
      <ol className="joined">
        {profile.isInstructor ? (
          // If the user is an instructor, display classes taught by the instructor
          createdClasses.map((classItem) => (
            <CreateCard keyname={classItem.name} title={classItem.name} classcode={classItem.classcode} isInstructor={profile.isInstructor} profileId={profileId}/>
          ))
        ) : (
          // If the user is a student, display classes joined by the student
          createdClasses.map((classItem) => (
            <CreateCard keyname={classItem.name} title={classItem.name} owner={classItem.owner.name} classcode={classItem.classcode} isInstructor={profile.isInstructor} profileId={classItem.owner._id}/>
          ))
        )}
      </ol>
      <Footer />
    </>
  );
}

export default Home;
