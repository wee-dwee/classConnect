import React, { useState, useEffect } from 'react';
import './mainstyle.css';
import Navbar from './Navbar';
import Announcment from './Announcment.js';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useParams, useHistory } from "react-router-dom";

export default function Main({ username }) {
  const [showInput, setShowInput] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [classname, setClassname] = useState("");
  const [classoname, setClassoname] = useState("");
  const [classjcode, setClassjcode] = useState("");
  const [classoid, setClassoid] = useState("");
  const [profile, setProfile] = useState(null); // State to hold profile details
  const { classId } = useParams();
  const { profileId } = useParams();
  const [checkisinst,setcheckisinst]=useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/profiles/${profileId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile details');
        }
        const data = await response.json();
        setcheckisinst(data.isInstructor);
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };
    fetchProfileDetails();
  }, [profileId]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/classesbyId/${classId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch class details');
        }
        const data = await response.json();
        setClassname(data.name);
        setClassoname(data.owner.name);
        setClassjcode(data.classcode);
        setClassoid(data.owner._id);
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    fetchClassDetails();
  }, [classId]);

  const handleAnnouncementSubmit = async () => {
    try {
      // Get the file input element
      const fileInput = document.getElementById('fileInput');
      // Get the selected files
      const files = fileInput.files;
  
      // Create a FormData object to send files along with other data
      const formData = new FormData();
      formData.append('title', 'Announcement Title'); // Change as needed
      formData.append('content', inputValue); // Use the input value
      formData.append('createdBy', classoid);
      
      // Append each selected file to the FormData object
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
  
      // Send the data to the server
      const response = await fetch(`http://localhost:3002/classes/${classId}/add-announcements`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to add announcement');
      }
      // Clear input field and hide input
      setInputValue("");
      setShowInput(false);
      window.location.reload();
      // Reload announcements
      // You can use a similar approach as fetching class details
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };
  

  return (
    <>
      <Navbar username={username} profileId={profileId} />
      <div className="main">
        <div className="main__wrapper">
          <div className="main__content">
            <div className="main__wrapper1">
              <div className="main__bgImage">
                <div className="main__emptyStyles" />
              </div>
              <div className="main__text">
                <h4 className="main__heading main__overflow">
                  {classname}
                </h4>
                <div className="main__section main__overflow">
                  {classoname}
                </div>
                <div className="main__wrapper2">
                  <em className="main__code">Class Code : {classjcode}</em>
                </div>
              </div>
            </div>
          </div>
          <div className="main__announce">
            <div className="main__announcements">
              <div className="main__announcementsWrapper">
                <div className="main__ancContent">
                  {checkisinst === false ? (
                    <div className="main__wrapper100">
                      <Avatar />
                      <div>View the announcements</div>
                    </div>
                  ) : showInput ? (
                    <div className="main__form">
                      <TextField
                        id="filled-multiline-flexible"
                        multiline
                        label="Announce Something to Class"
                        variant="filled"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} />
                      <div className="main__buttons">
                        <input type="file" id='fileInput' variant="outlined" color="primary" multiple/>
                        <div>
                          <Button onClick={() => { setShowInput(false); setInputValue(""); }} className="cancelbutton">
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={handleAnnouncementSubmit} // Call the function to handle announcement submission
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="main__wrapper100" onClick={() => setShowInput(true)}>
                      <Avatar />
                      <div>Announce Something to Class</div>
                    </div>
                  )}
                </div>
              </div>
              <Announcment classId={classId} senderName={profileId}/>
              {/* Add "See Students" button here */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
