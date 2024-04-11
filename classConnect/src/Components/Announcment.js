import React, { useState, useEffect } from "react";
import "./Announcment.css";
import Avatar from "@mui/material/Avatar";
import student from "./student.png";

export default function Announcement({ classId, senderName }) {
  const [announcements, setAnnouncements] = useState([]);
  const [messageContents, setMessageContents] = useState({});

  useEffect(() => {
    fetchAnnouncements();
  }, [classId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/classes/${classId}/announcements`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  console.log(announcements);
  const downloadFile = (file) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `http://localhost:3002/uploads/${file}`;
    downloadLink.download = file;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const renderFilePreview = (file) => {
    const extension = file.split(".").pop().toLowerCase();
    switch (extension) {
      default:
        return (
          <button
            className="download-btn"
            onClick={() => downloadFile(file)}
            style={{ color: "black" }}
          >
            {file}
          </button>
        );
    }
  };

  const handleAddMessage = async (announcementId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/classes/${classId}/announcements/${announcementId}/add-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageContent: messageContents[announcementId], sender: senderName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add message");
      }
      fetchAnnouncements(); // Refresh announcements after adding message
      setMessageContents(""); // Clear message content input field
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };
  
  const handleMessageChange = (announcementId, value) => {
    setMessageContents({ ...messageContents, [announcementId]: value });
  };

  return (
    <div>
      {announcements
        .slice()
        .reverse()
        .map((announcement, index) => (
          <div key={index} className="amt">
            <div className="amt__Cnt">
              <div className="amt__top">
                <Avatar />
                <div>{announcement.classOwner}</div>
                <div className="dateandtime">
                  {new Date(announcement.createdAt).toLocaleString()}
                </div>
              </div>
              <p className="amt__txt">{announcement.content}</p>
              {/* Show messages */}
              {announcement.messages &&
                announcement.messages.map((message, idx) => (
                  <div key={idx} className="message">
                    <Avatar />
                    <div>{message.sender.name}</div>
                    <div className="dateandtime">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))}
              {/* Show files */}
              {announcement.files &&
                announcement.files.map((file, idx) => (
                  <div key={idx} className="file-preview">
                    {renderFilePreview(file)}
                  </div>
                ))}
              {/* Add message form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddMessage(announcement._id);
                }}
              >
                <input
                  type="text"
                  value={messageContents[announcement._id] || ""}
                  onChange={(e) => handleMessageChange(announcement._id, e.target.value)}
                  placeholder="Type your message..."
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        ))}
    </div>
  );
}
