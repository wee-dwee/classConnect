import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams } from "react-router-dom"; // Added useParams

function CreateClassForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { profileId } = useParams();
  console.log(profileId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        
      // Make a POST request to create a new class
      const response = await axios.post('http://localhost:3002/classes', {
        name,
        OwnerUserID: profileId,
        bio,
        classcode: classCode
      });
      // Display success message if class creation is successful
      setMessage(response.data.message);
      // Reset form fields
      setName('');
      setBio('');
      setClassCode('');
    } catch (error) {
      // Display error message if class creation fails
      setMessage('Error creating class');
      console.error('Error creating class:', error);
    }
  };

  return (
    <div>
      <h2>Create Class</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Class Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Bio:</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} required />
        </div>
        <div>
          <label>Class Code:</label>
          <input type="text" value={classCode} onChange={(e) => setClassCode(e.target.value)} required />
        </div>
        <button type="submit">Create Class</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateClassForm;
