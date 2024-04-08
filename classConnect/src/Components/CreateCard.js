import Avatar from "@mui/material/Avatar";
import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import teacher from './teacher.png';

const CreateCard = ({ keyname, owner, classcode, isInstructor,profileId
 }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [checkin,setcheckin]=useState(false);
  useEffect(() => {
    // Fetch user profile when component mounts
    fetchUserProfile(profileId);
  }, [profileId]);

  const fetchUserProfile = async (profileId) => {
    try {
      // Assuming you have an API endpoint to fetch user profile data
      const response = await fetch(`http://localhost:3002/profiles/${profileId}`);
      const data = await response.json();
      console.log(data.image);
      setcheckin(isInstructor); // Update checkin state with fetched data
      setUserProfile(data); // Update userProfile state with fetched data
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  return (
    <div className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__imgWrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            <Link className="joined__title" to={"/main"}>
              <h2>{keyname}</h2>
            </Link>
            <p className="joined__owner">
              {isInstructor ? classcode : owner}
            </p>
          </div>
        </div>
        {userProfile && userProfile.image ? (
              <img src={`http://localhost:3002/uploads/${userProfile.image}`} alt="Default Student Image" className="joined__avatar" />
                ) : (
                  <img src={teacher} alt="Default Student Image" className="joined__avatar" />
                )}
        
      </div>
      <div>
      </div>
      <div className="joined__bottom">
        <PermContactCalendar />
        <FolderOpen />
      </div>
    </div>
  );
};

export default CreateCard;
