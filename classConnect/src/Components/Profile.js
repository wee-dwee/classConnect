import React, { useState } from 'react';
import './Profile.css';
import Navbar from './Navbar';
import Footer1 from './Footer1';

export default function Profile() {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const handleImageClick = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };

  return (
    <>
      <Navbar />
      <div className="create-box">
        <div className='upc'>
          <div className="gradient"></div>
          <div className="profile-down">
            <img 
              src="https://source.unsplash.com/random" 
              alt="No image" 
              onClick={handleImageClick} 
              className={isImageEnlarged ? "enlarged-image" : ""}
            />
            <div className="profile-title">Vinit Mehta</div>
            <div className="profile-email">vinitmehta383@gmail.com</div>
            <div className="profile-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quae quod quo repellendus eaque incidunt tenetur explicabo placeat, nemo, animi ab! Molestiae itaque suscipit deserunt reprehenderit quis earum, sint obcaecati sunt eos voluptatibus nostrum?
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}
