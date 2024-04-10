import Avatar from "@mui/material/Avatar";
import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import teacher from './teacher.png';
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
const CreateCard = ({ classId, title, owner, classcode, isInstructor, profileId, setuserclassId, thisprofileId }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [checkin, setCheckin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
      setCheckin(isInstructor); // Update checkin state with fetched data
      setUserProfile(data); // Update userProfile state with fetched data
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleClassSelection = () => {
    // Assuming you want to set the user class id when the class is selected
    setuserclassId(profileId);
  };

  return (
    <div className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__menu">
          <IconButton aria-label="settings" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleClick} style={{ color: 'white' }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Unenroll</MenuItem>
          </Menu>
        </div>
        <div className="joined__container">
          <div className="joined__imgWrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            <Link className="joined__title" to={`/main/${classId}/${thisprofileId}`} onClick={handleClassSelection}>
              <h2>{title}</h2>
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
