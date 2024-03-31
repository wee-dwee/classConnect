import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState('');
  const { username } = useParams();
  
  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post(`http://localhost:3002/upload-image/${username}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log('Image uploaded successfully');
      // Handle success, if needed
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error, if needed
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-inner' style={{ width: 'auto' }}>
        <div>Let's Upload Image for your account: {username}</div>
        <form onSubmit={submitImage}>
          <input type="file" accept='image/*' onChange={onInputChange} />
          <button type='submit'>Upload Image</button>
        </form>
      </div>
    </div>
  );
}

export default ImageUpload;
