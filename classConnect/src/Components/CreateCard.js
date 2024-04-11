import Avatar from "@mui/material/Avatar";
import { FolderOpen, PermContactCalendar } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./style.css";
import teacher from "./teacher.png";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
const CreateCard = ({
  classId,
  title,
  owner,
  classcode,
  isInstructor,
  profileId,
  setuserclassId,
  thisprofileId,
}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeeStudents = () => {
    // Redirect to see students page
    history.push(`/see-students/${classId}`);
  };

  useEffect(() => {
    fetchUserProfile(profileId);
  }, [profileId]);

  const fetchUserProfile = async (profileId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/profiles/${profileId}`
      );
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleClassSelection = () => {
    setuserclassId(profileId);
  };

  const handleDeleteClass = async () => {
    try {
      const response = await fetch(`http://localhost:3002/classes/${classId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classId,
        }),
      });
      const data = await response.json();
      console.log(data.message); // Log the response message
      window.location.reload();
      // You may want to perform additional actions here, such as updating UI or state
    } catch (error) {
      console.error("Error deleting class:", error);
    } finally {
      handleClose(); // Close the menu regardless of success or failure
    }
  };
  const handleUnenroll = async () => {
    try {
      const response = await fetch("http://localhost:3002/unenroll-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classId,
          profileId: thisprofileId,
        }),
      });
      const data = await response.json();
      console.log(data.message); // Log the response message
      window.location.reload();
      // You may want to perform additional actions here, such as updating UI or state
    } catch (error) {
      console.error("Error unenrolling from class:", error);
    } finally {
      handleClose(); // Close the menu regardless of success or failure
    }
  };
  return (
    <div className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__menu">
          <IconButton
            aria-label="settings"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleClick}
            style={{ color: "white" }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            {isInstructor ? (
              <MenuItem onClick={handleDeleteClass}>Delete Class</MenuItem>
            ) : (
              <MenuItem onClick={handleUnenroll}>Unenroll</MenuItem>
            )}
            <MenuItem onClick={handleSeeStudents}>
              See enrolled Students
            </MenuItem>
          </Menu>
        </div>
        <div className="joined__container">
          <div className="joined__imgWrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            <Link
              className="joined__title"
              to={`/main/${classId}/${thisprofileId}`}
              onClick={handleClassSelection}
            >
              <h4>{title}</h4>
            </Link>
            <p className="joined__owner">{isInstructor ? classcode : owner}</p>
          </div>
        </div>
        {userProfile && userProfile.image ? (
          <img
            src={`http://localhost:3002/uploads/${userProfile.image}`}
            alt="Default Student Image"
            className="joined__avatar"
          />
        ) : (
          <img
            src={teacher}
            alt="Default Student Image"
            className="joined__avatar"
          />
        )}
      </div>
      <div></div>
      <div className="joined__bottom">
        <PermContactCalendar />
        <FolderOpen />
      </div>
    </div>
  );
};

export default CreateCard;
