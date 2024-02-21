import React, { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

import Dashboard from "./Dashboard";

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  color: #61dafb;
  font-size: 2rem;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  border: 1px solid #61dafb;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #61dafb;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218eff;
  }
`;

const AnimatedDiv = styled(animated.div)`
  margin-top: 20px;
  font-size: 1.2rem;
  color: ${(props) => (props.error ? "#ff4757" : "#2ecc71")};
`;

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const props = useSpring({
    opacity: 1,
    marginTop: 0,
    from: { opacity: 0, marginTop: -50 },
  });

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3002/api/register", {
        username,
        password,
      });
      setMessage("Registration successful");
      setError(false);
    } catch (error) {
      setMessage("Error during registration");
      setError(true);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3002/api/login", {
        username,
        password,
      });
      //setMessage(`Login successful. Token: ${response.data.token}`);
      setError(false);
      setLoggedIn(true);
    } catch (error) {
      setMessage("Invalid credentials");
      setError(true);
    }
  };
  const handleLogout = () => {
    // Perform any logout logic here
    // For simplicity, we will just set loggedIn to false
    setLoggedIn(false);
    // Redirect to the login page after logout
    return <Navigate to="/" />;
  };
  return (
    <Router>
      <Container>
        {!loggedIn && (
          <>
            <Title>Login App</Title>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Button onClick={handleRegister}>Register</Button>
            <Button onClick={handleLogin}>Login</Button>
          </>
        )}
        {loggedIn && (
          <>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        )}
        {loggedIn && <Navigate to="/dashboard" />}
        <AnimatedDiv style={props} error={error}>
          {message}
        </AnimatedDiv>
      </Container>

      <Routes>
        <Route
          path="/dashboard"
          element={loggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
