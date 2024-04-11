import "./Profile.css";
import { Link, useLocation, useParams } from "react-router-dom"; // Added useParams
import Navbar from "./Navbar";
import Footer1 from "./Footer1";
import React, { useState, useEffect } from "react";
import axios from "axios";
import student from "./student.png";
import teacher from './teacher.png';

export default function Profile() {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { profileId } = useParams(); // Added to extract username from URL params
  const [checkin,setcheckin]=useState(false); // Initialize checkin state to false

  useEffect(() => {
    // Fetch data from the backend with the username as a query parameter
    axios
      .get(`http://localhost:3002/profiles/${profileId}`)
      .then((response) => {
        setProfile(response.data);
        setcheckin(response.data.isInstructor);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setIsLoading(false);
      });
  }, [profile.name]); // Updated to use username from URL params

  const handleImageClick = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };
  return (
    <>
      <Navbar username={profile.name} profileId={profileId}/>
      <div className="supportme">

      
      <div className="create-box">
        <div className="upc">
          <div className="gradient"></div>
          <div className="profile-down">
            {isLoading ? (
              <p>Loading profile...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              <>
                {profile.image ? (
                  <img
                    src={`http://localhost:3002/uploads/${profile.image}`}
                    alt="Profile Image"
                    onClick={handleImageClick}
                    className={isImageEnlarged ? "enlarged-image" : ""}
                  />
                ) : (
                  <img
                    src={checkin ? teacher : student} 
                    alt="Default Student Image"
                    onClick={handleImageClick}
                    className={isImageEnlarged ? "enlarged-image" : ""}
                  />
                )}

                <div className="profile-title">{profile.name}</div>
                <div className="profile-email">{profile.email}</div>
                <div className="profile-description">{profile.bio}</div>
                {/* <Link to={`/editprofile/${username}`}>Edit Profile</Link> */}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer1 />
    </>
  );
}
