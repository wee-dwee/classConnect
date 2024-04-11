import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams, useHistory } from "react-router-dom"; 
import './CreateClassForm.css'; 
import Navbar from './Navbar';
import Footer3 from './Footer3';

function CreateClassForm({ username }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const location = useLocation();
  const { profileId } = useParams();
  const history = useHistory(); 
  
  useEffect(() => {
    
    setGeneratedCode(generateRandomCode());
  }, []); 

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {  
      // Make a POST request to create a new class
      const response = await axios.post('http://localhost:3002/classes', {
        name,
        OwnerUserID: profileId,
        bio,
        classcode: generatedCode 
      });
      
      
      setMessage(response.data.message);
      
      
      setName('');
      setBio('');
      
      
      alert('Class created successfully!');
      
      
      history.push(`/home/${profileId}`);
      
    } catch (error) {
      
      setErrorMessage('Error creating class');
      console.error('Error creating class:', error);
    }
  };

  return (
    <>
      <Navbar username={username} profileId={profileId}/>
      <div className="supportus">
      <div className="create-class-form-container"> {/* Added className for styling */}
        <h2 className="formhead">Create Class</h2>
        {generatedCode && (
          <div>
            <p className="generated-code">Generated Code: {generatedCode}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label className="headings">Class Name:</label>
            <input type="text" className="inputcreate"value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="headings">Bio:</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} required className="bio-textarea"/>
          </div>
          <button type="submit" className="createclassbtn">Create Class</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {message && <p>{message}</p>}
      </div>
      </div>
      <Footer3 />
    </>
  );
}

export default CreateClassForm;
