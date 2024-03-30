import React, { useState } from 'react';
import {Link, useLocation, useParams } from 'react-router-dom'; // Added useParams
function ImageUpload({}) {
  const [image, setImage] = useState('');
  const { username } = useParams(); 
  function convertToBase64(e) {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-inner' style={{ width: 'auto' }}>
        <div>Let's Upload Image for your account: {username}</div> {/* Display username */}
        <input accept='image/*' type='file' onChange={convertToBase64} />
        {image === '' || image === null ? null : <img src={image} alt='Uploaded' />}
      </div>
    </div>
  );
}

export default ImageUpload;
