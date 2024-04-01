import React, { useState, useCallback } from "react";
import "./App.css";
import Loginform from "./Components/Loginform";
import Register from "./Components/Register";
import ForgotPassword from "./Components/Forgotpassword";
import Profile from "./Components/Profile";
import EditProfile from "./Components/editprofile";
import Home from "./Components/home"; 
import { Route, Switch, Link, useLocation } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import Navbar from "./Components/Navbar";
import CreateClassForm from "./Components/createclass";

function App() {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [profileId, setProfileId] = useState("");

  const setUsernameFromLoginForm = useCallback((enteredUsername) => {
    setUsername(enteredUsername);
  }, []);
  const setProfileFromLoginForm = useCallback((enteredProfile) => {
    setProfileId(enteredProfile);
  }, []);
  console.log(profileId)
  return (
    <div>
      <UserContextProvider>
        {/* <Navbar p={username} /> */}
        <Switch>
          <Route exact path="/">
            <Loginform setUsername={setUsernameFromLoginForm} setProfileId={setProfileFromLoginForm}/>
          </Route>
          <Route exact path="/forgotpassword">
            <ForgotPassword />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/createclass/:profileId">
            <CreateClassForm />
          </Route>
          {/* <Route exact path='/seeprofile'>
            <Link
              to={{
                pathname:  `/seeprofile/${username}`,
                state: { username: username }
              }}
            >
              See Profile
            </Link>
          </Route> */}
          <Route exact path="/seeprofile/:profileId">
            <Profile />
          </Route>
          <Route exact path="/editprofile/:profileId">
            <EditProfile />
          </Route>
        </Switch>
      </UserContextProvider>
    </div>
  );
}

export default App;
