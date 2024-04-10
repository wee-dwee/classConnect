import React, { useState, useEffect } from 'react';
import './Announcment.css';
import Avatar from '@mui/material/Avatar';
import student from "./student.png";

export default function Announcement({ classId }) {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, [classId]); // Include classId in the dependency array to re-fetch announcements when it changes

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`http://localhost:3002/classes/${classId}/announcements`);
            if (!response.ok) {
                throw new Error('Failed to fetch announcements');
            }
            const data = await response.json();
            setAnnouncements(data); // Update state using setAnnouncements
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    return (
        <div>
            {announcements.slice().reverse().map((announcement, index) => (
                <div key={index} className="amt">
                    <div className="amt__Cnt">
                        <div className="amt__top">
                            <Avatar />
                            <div>{announcement.classOwner}</div>
                            <div className="dateandtime">{new Date(announcement.createdAt).toLocaleString()}</div> {/* Display date and time */}
                        </div>
                        <p className="amt__txt">{announcement.content}</p>
                        <img className="amt__img" src={announcement.image || student} alt="No image" />
                    </div>
                </div>
            ))}
        </div>
    );
}
