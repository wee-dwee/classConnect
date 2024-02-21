import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any logout logic here
    // For simplicity, we will just navigate back to the login page
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Add your dashboard content here */}
    </div>
  );
};

export default Dashboard;
