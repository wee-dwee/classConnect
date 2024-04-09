import React from 'react';
import './Announcment.css';
import Avatar from '@mui/material/Avatar';
import {useState,useEffect} from 'react';
import student from "./student.png";

export default function Announcment() {
    const [announcement, setAnnouncement] = useState([]);

    useEffect(() => {
        const announcement1 = {
            email: "vinitmehta383",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, libero!",
            image: "https://source.unsplash.com/"
        };
        const announcement2 = {
            email: "vinitmehta383",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, libero!",
            image: "https://source.unsplash.com/"
        };
        const announcement3 = {
            email: "vinitmehta383",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, libero!",
            image: "https://source.unsplash.com/"
        };
        const announcement4 = {
            email: "vinitmehta383",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, libero!",
            image: "https://source.unsplash.com/"
        };
        const announcement5 = {
            email: "vinitmehta383",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, libero!",
            image: "https://source.unsplash.com/"
        };
        setAnnouncement([announcement1,announcement2,announcement3,announcement4,announcement5]);
    }, []);
  return (
    <div>
      {announcement.map((item) => (
        <div className="amt">
          <div className="amt__Cnt">
            <div className="amt__top">
              <Avatar />
              <div>{item.email}</div>
            </div>
            <p className="amt__txt">{item.text}</p>
            <img className="amt__img" src={student} alt="No image"/>
          </div>
        </div>
      ))}
    </div>
  )
}
