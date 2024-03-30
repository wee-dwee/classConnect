import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
// Added useParams

function ImageUpload() {
  const [image, setImage] = useState('');
  const { username } = useParams();
  const newUsername = username.substring(1); // Remove the first character from username

  function convertToBase64(e) {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  // Function to upload image using Axios
  const uploadImage = () => {
    if (image) {
      axios
        .post('http://localhost:3002/upload-image', {
          username: newUsername, // Use the modified username
          image: image,
        })
        .then((response) => {
          console.log('Image uploaded successfully:', response.data);
          // Handle success, if needed
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          // Handle error, if needed
        });
    } else {
      console.error('No image selected.');
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-inner' style={{ width: 'auto' }}>
        <div>Let's Upload Image for your account: {newUsername}</div>
        <input accept='image/*' type='file' onChange={convertToBase64} />
        <button onClick={uploadImage}>Upload Image</button>
      </div>
    </div>
  );
}

export default ImageUpload;
