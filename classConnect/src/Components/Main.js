import React from 'react';
import {useState} from 'react'
import './mainstyle.css';
import Navbar from './Navbar';
import Announcment from './Announcment.js';
// import { Avatar, Button, TextField } from "@material-ui/core";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Main({username,profileId}) {

  const [showInput,setShowInput] = useState(false);
  const [inputValue, setInput] = useState("");
  const [image, setImage] = useState(null);

  return (

    <>
    <Navbar username={username} profileId={profileId}/>
    <div className="main">
      <div className="main__wrapper">
        <div className="main__content">
          <div className="main__wrapper1">
            <div className="main__bgImage">
              <div className="main__emptyStyles" />
            </div>
            <div className="main__text">
              <h4 className="main__heading main__overflow">
                Database Management System
              </h4>
              <div className="main__section main__overflow">
                P.M Jatt
              </div>
              <div className="main__wrapper2">
                <em className="main__code">Class Code : 123456</em>
                {/* <div className="main__id">AarshBhosdino</div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="main__announce">
          <div className="main__announcements">
            <div className="main__announcementsWrapper">
              <div className="main__ancContent">
                {showInput ? (
                <div className="main__form">
                  <TextField 
                  id="filled-multiline-flexible"
                  multiline
                  label="Announce Something to Class"
                  variant="filled"
                  value={inputValue}
                  onChange={(e) => setInput(e.target.value)}/>
                  <div className="main__buttons">
                    <input type="file" variant="outlined" color="primary"/>
                    <div>
                      <Button onClick={() => setShowInput(false)} className="cancelbutton">
                        Cancel
                      </Button>
                      <Button
                      color="primary"
                      variant="contained"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
                ):(
                  <div className="main__wrapper100" onClick={()=>setShowInput(true)}>
                  <Avatar />
                  <div>Announce Something to Class</div>
                </div>
                )}
                
              </div>
            </div>
            <Announcment />
          </div>
        </div>
      </div>
    </div>
    </>
    
  )
}
