import React from 'react'
import './LoginForm.css';
import {FaEnvelope,FaLock} from "react-icons/fa";

export default function Loginform() {
  return (
    <div className='wrapper'>
        <form action="">
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
                
                <a href='#'>Forgot Password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
                <p>Don't have an account? <a href='#'>Register</a></p>
            </div>
        </form>
    </div>
  )
}
