import React from 'react';
import './LoginForm.css';
import {FaEnvelope,FaLock} from "react-icons/fa";
import {Link} from 'react-router-dom';

export default function Forgotpassword() {
  return (
    <div className="login">
    <div className='wrapper'>
        <form>
            <h1>Forgot Password?</h1>
            <div className="input-box">
                <input type="password" placeholder='Enter New Password' required/>
                <FaEnvelope className='icon'/>
            </div>
            <div className="input-box">
                <input type="password" placeholder='Confirm Password' required/>
                <FaLock className='icon'/>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
    </div>
  )
}
