import React, { useState, useCallback } from "react";
import "./App.css";
import Loginform from "./Components/Loginform";
import Register from "./Components/Register";
import ForgotPassword from "./Components/Forgotpassword";
import Profile from "./Components/Profile";
import EditProfile from "./Components/editprofile";
import AboutUs from "./Components/AboutUs.js";
import ContactUs from "./Components/ContactUs.js";
import Home from "./Components/home"; 
import { Route, Switch, Link, useLocation } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import Navbar from "./Components/Navbar";
import CreateClassForm from "./Components/createclass";
import JoinClassPage from "./Components/joinclass";
import CreateCard from './Components/CreateCard.js';
import Main from './Components/Main.js';
import SeeStudents from './Components/SeeStudents.js';
function App() {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [profileId, setProfileId] = useState("");
  const [classId,setuserclassId]=useState("");
  const createdClasses = [
    { id: 1, title: "Class 1", owner: "owner1@example.com" },
    { id: 2, title: "Class 2", owner: "owner2@example.com" },
    { id: 3, title: "Class 3", owner: "owner3@example.com" },
    { id: 4, title: "Class 4", owner: "owner4@example.com" },
    { id: 5, title: "Class 5", owner: "owner5@example.com" },
    { id: 6, title: "Class 6", owner: "owner6@example.com" },
    { id: 7, title: "Class 7", owner: "owner7@example.com" },
    { id: 8, title: "Class 8", owner: "owner8@example.com" },
    { id: 9, title: "Class 9", owner: "owner9@example.com" }
  ];

  const setUsernameFromLoginForm = useCallback((enteredUsername) => {
    setUsername(enteredUsername);
  }, []);
  const setProfileFromLoginForm = useCallback((enteredProfile) => {
    setProfileId(enteredProfile);
  }, []);
  const setuserclassIdFromClasses = useCallback((enteredClassId) => {
    setuserclassId(enteredClassId);
  }, []);
  console.log(classId);
  console.log("prof");
  return (
    <div>
      <UserContextProvider>
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
          <Route exact path="/main/:classId/:profileId">
            <Main username={username} />
          </Route>
          <Route exact path="/home/:profileId">
            <Home setuserclassId={setuserclassIdFromClasses} />
          </Route>
          <Route exact path="/createclass/:profileId">
            <CreateClassForm username={username} profileId={profileId}/>
          </Route>
          <Route exact path="/seeprofile/:profileId">
            <Profile />
          </Route>
          <Route exact path="/editprofile/:profileId">
            <EditProfile />
          </Route>
          <Route exact path="/join-class/:profileId">
            <JoinClassPage username={username} profileId={profileId}/>
          </Route>
          {/* <Route exact path="/createcard">
          <ol className="joined">
            {createdClasses.map((item) => (
              <CreateCard/>
            ))}
          </ ol>
          </Route> */}
          <Route exact path="/aboutus/:profileId">
            <AboutUs username={username}/>
          </Route>
          <Route exact path="/contactus/:profileId">
            <ContactUs username={username}/>
          </Route>
          <Route exact path="/see-students/:classId">
            <SeeStudents/>
          </Route>
        </Switch>
      </UserContextProvider>
    </div>
  );
}

export default App;
