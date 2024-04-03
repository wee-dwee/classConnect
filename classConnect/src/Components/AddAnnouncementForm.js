import React, { useState } from 'react';
import axios from 'axios';

const AddAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/add-announcement/:classId', {
        title,
        content,
        createdBy: 'user_id' // Replace 'user_id' with the actual user ID
      });
      
      console.log('Announcement added:', response.data);
      setSuccess(true);
      setError(null);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding announcement:', error.response.data);
      setError(error.response.data.error);
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2>Add Announcement</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Announcement added successfully</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Content:
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        <button type="submit">Add Announcement</button>
      </form>
    </div>
  );
};

export default AddAnnouncement;