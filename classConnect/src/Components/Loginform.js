import React from 'react'
import './LoginForm.css';
import {FaEnvelope,FaLock} from "react-icons/fa";
import {Link} from 'react-router-dom';

export default function Loginform() {
  return (
    <div className="login">
    <div className='wrapper'>
        <form>
            <h1>Login</h1>
            <div className="input-box">
                <input type="email" placeholder='Enter Email' required/>
                <FaEnvelope className='icon'/>
            </div>
            <div className="input-box">
                <input type="password" placeholder='Enter Password' required/>
                <FaLock className='icon'/>
            </div>
            <div className="remember-forgot">
                <Link to='/forgotpassword'>Forgot Password?</Link>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
                <p>Don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </form>
    </div>
    </div>
  )
}
