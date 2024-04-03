import Avatar from "@mui/material/Avatar";
import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import student from "./student.png";
import teacher from './teacher.png';

const CreateCard = ({ keyname, owner, classcode, isInstructor }) => {
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
            <p className="joined__owner">
              {isInstructor ? classcode : owner}
            </p>
          </div>
        </div>
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
