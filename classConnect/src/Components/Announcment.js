import React, { useState, useEffect } from "react";
import "./Announcment.css";
import Avatar from "@mui/material/Avatar";
import student from "./student.png";

export default function Announcement({ classId }) {
  const [announcements, setAnnouncements] = useState([]);

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
              {announcement.files &&
                announcement.files.map((file, idx) => (
                  <div key={idx} className="file-preview">
                    {renderFilePreview(file)}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
