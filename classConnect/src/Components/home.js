import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useParams, useHistory } from "react-router-dom";
import Footer3 from './Footer3.js';
import Footer from './Footer.js';
import Navbar from './Navbar.js';
import CreateCard from './CreateCard.js';
import './home.css';
function Home({setuserclassId}) {
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
  console.log(profile.isInstructor);
  // Function to handle class selection
  const handleClassSelection = (classId) => {
    setuserclassId(classId);
  };

  return (
    <>
      <Navbar username={profile.email} profileId={profileId} />
      <ol className="joined">
      {createdClasses.length === 0 && (
          <p className="statement">{profile.isInstructor ? "No classes created by you" : "No classes joined yet"}</p>
        )}
        {profile.isInstructor ? (
          // If the user is an instructor, display classes taught by the instructor
          createdClasses.map((classItem) => (
            <CreateCard 
            classId={classItem._id} 
              title={classItem.name} 
              classcode={classItem.classcode} 
              isInstructor={profile.isInstructor} 
              profileId={profileId}
              thisprofileId={profileId}
              onSelectClass={() => handleClassSelection(classItem._id)} // Pass onSelectClass function to handle class selection
              setuserclassId={setuserclassId}
            />
          ))
        ) : (
          // If the user is a student, display classes joined by the student
          createdClasses.map((classItem) => (
            <CreateCard 
            classId={classItem._id} 
              title={classItem.name} 
              owner={classItem.owner.name} 
              classcode={classItem.classcode} 
              isInstructor={profile.isInstructor} 
              profileId={classItem.owner._id}
              thisprofileId={profile._id} 
              onSelectClass={() => handleClassSelection(classItem._id)} // Pass onSelectClass function to handle class selection
              setuserclassId={setuserclassId}
            />
          ))
        )}
      </ol>
      {createdClasses.length === 0 ? <Footer /> : <Footer3 />}
    </>
  );
}

export default Home;
