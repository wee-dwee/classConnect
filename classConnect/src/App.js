import React, { useState, useCallback } from 'react';
import './App.css';
import Loginform from './Components/Loginform';
import Register from './Components/Register';
import ForgotPassword from './Components/Forgotpassword';
import Profile from './Components/Profile';
import EditProfile from './Components/editprofile';
import Home from './Components/home'; // Assuming you have a Home component
import { Route, Switch, Link, useLocation } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import Navbar from './Components/Navbar';


function App() {
  const location = useLocation();
  const [username, setUsername] = useState('');

  const setUsernameFromLoginForm = useCallback((enteredUsername) => {
    setUsername(enteredUsername);
  }, []);

  return (
    <div>
      <UserContextProvider>
        <Navbar username={username}/>
        <Switch>
          <Route exact path='/'>
            <Loginform setUsername={setUsernameFromLoginForm} />
          </Route>
          <Route exact path='/forgotpassword'>
            <ForgotPassword />
          </Route>
          <Route exact path='/register'>
            <Register />
          </Route>
          <Route exact path='/home'>
            <Home />
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
          <Route exact path='/seeprofile/:username'>
            <Profile />
          </Route>
          <Route exact path='/editprofile/:username'>
            <EditProfile />
          </Route>
        </Switch>
      </UserContextProvider>
    </div>
  );
}

export default App;
