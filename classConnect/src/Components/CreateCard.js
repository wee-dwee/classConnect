import Avatar from "@mui/material/Avatar";
import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const JoinedClasses = () => {
  return (
        <div className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__imgWrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            <Link className="joined__title" to={"/profile"}>
              <h2>Robotics</h2>
            </Link>
            <p className="joined__owner">vinitmehta382@gmail.com</p>
          </div>
        </div>
        <Avatar
          className="joined__avatar"
          src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s75-c-fbw=1/photo.jpg"
        />
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

export default JoinedClasses;
