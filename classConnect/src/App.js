import './App.css';
import Loginform from './Components/Loginform';
import Register from './Components/Register';
import ForgotPassword from './Components/Forgotpassword';
import {Route,Switch} from 'react-router-dom';
import Home from './Components/home';
function App() {
  return (
    <div>
        
        <Switch>
            <Route exact path='/'><Loginform/></Route>
            <Route exact path='/forgotpassword'>
              <ForgotPassword />
            </Route>
            <Route exact path='/register'>
              <Register />
            </Route>
            <Route exact path='/home'>
              <Home />
            </Route>
        </Switch>
    </div>
  );
}

export default App;