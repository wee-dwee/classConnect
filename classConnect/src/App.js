import './App.css';
import Loginform from './Components/Loginform';
import Register from './Components/Register';
import ForgotPassword from './Components/Forgotpassword';
import {Route,Switch} from 'react-router-dom';
function App() {
  return (
    <div>
        <Loginform/>
        <Switch>
            <Route exact path='/forgotpassword'>
              <ForgotPassword />
            </Route>
            <Route exact path='/register'>
              <Register />
            </Route>
        </Switch>
    </div>
  );
}

export default App;