import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import axios from 'axios';
const SeeStudents = () => {
  // State to hold the list of students
  const [students, setStudents] = useState([]);
const { classId } = useParams();
  // Function to fetch students when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch students for the specified class ID
        const response = await axios.get(`http://localhost:3002/classes/${classId}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  }, [classId]); // Fetch students whenever the class ID changes

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Students in Class</h2>
      <ul style={styles.studentList}>
        {/* Map over the list of students and render each student */}
        {students.map((student, index) => (
          <li key={index} style={styles.studentItem}>{student}</li>
        ))}
      </ul>
    </div>
  );
};

export default SeeStudents;

// Inline styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    margin: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center', 
    margin: '20px'
  },
  studentList: {
    listStyleType: 'none',
    padding: 0,
    fontWeight:'450',
  },
  studentItem: {
    marginBottom: '5px',
    fontSize: '18px',
  },
};
