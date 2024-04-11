import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

const SeeStudents = () => {
  const [students, setStudents] = useState([]);
  const { classId } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/classes/${classId}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  }, [classId]);

  return (
    <div style={styles.container}>
      {students.length > 0 && (
        <>
          <h2 style={styles.heading}>Students in Class</h2>
          <ul style={styles.studentList}>
            {students.map((student, index) => (
              <li key={index} style={styles.studentItem}>{student}</li>
            ))}
          </ul>
        </>
      )}
      {students.length === 0 && <p style={styles.noStudentsText}>No students in the class</p>}
    </div>
  );
};

export default SeeStudents;

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
  },
  studentList: {
    listStyleType: 'none',
    padding: 0,
    fontWeight: '450',
  },
  studentItem: {
    marginBottom: '5px',
    fontSize: '18px',
  },
  noStudentsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
  },
  noStudentsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
    fontSize: '20px', // Adjust the font size here
  },
};