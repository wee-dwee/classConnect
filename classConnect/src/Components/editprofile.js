import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './editprofile.css'; // Import CSS for styling
import Footer1 from './Footer1.js';
import Navbar from './Navbar.js';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Track whether profile update is in progress
  const { username } = useParams();
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3002/profiles/${username}`)
      .then(response => {
        const { name, email, bio } = response.data;
        setName(name);
        setEmail(email);
        setBio(bio);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setIsLoading(false);
      });
  }, [username]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true); // Set updating flag to true while request is in progress
    try {
      await axios.put(`http://localhost:3002/editprofile/${username}`, {
        name,
        email, // Include email in the request body for updating if needed
        bio
      });
      setIsUpdating(false); // Reset updating flag on successful update
      // Optionally, you can provide feedback to the user upon successful update
      alert('Profile updated successfully');
      history.push(`/seeprofile/${username}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error);
      setIsUpdating(false); // Reset updating flag on error
    }
  };

  return (
    <>
    <Navbar username={username}/>
    <div className="editprofile">
    <div className="edit-profile-container">
      <h2>Update Profile</h2>
      {isLoading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="emailfield">
          <span className="highlighted">Email : </span> {/* Highlight email */}
            <span>{email}</span> {/* Render email as text */}
          </label>
          <label>
          <span className="highlighted">Name : </span> {/* Highlight name */}
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          
          <label>
          <span className="highlighted">Bio : </span> {/* Highlight bio */}
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>
          <button type="submit" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update Profile'}</button>
        </form>
      )}
    </div>
    </div>
    <Footer1 />
    </>
    
  );
}