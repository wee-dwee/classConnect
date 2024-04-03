import Avatar from "@mui/material/Avatar";
import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import student from "./student.png";
import teacher from './teacher.png';

const CreateCard = ({keyname,title,classcode}) => {
  return (
        <div className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__imgWrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            <Link className="joined__title" to={"/profile"}>
              <h2>{keyname}</h2>
            </Link>
            <p className="joined__owner">Code:{classcode}</p>
          </div>
        </div>
        {/* <Avatar
          className="joined__avatar"
          src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s75-c-fbw=1/photo.jpg"
        /> */}
        <img src={teacher} alt="Default Student Image" className="joined__avatar" />
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
