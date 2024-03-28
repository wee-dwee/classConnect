import React from 'react';
import { IonIcon } from '@ionic/react';
import './Footer1.css';

const Footer = () => {
  return (
    <div className="foo">
          <footer className="footer">
          <div className="waves">
            <div className="wave" id="wave1"></div>
            <div className="wave" id="wave2"></div>
            <div className="wave" id="wave3"></div>
            <div className="wave" id="wave4"></div>
          </div>
          <p>&copy;Copyright : ClassConnect by ProjectDAVS</p>
        </footer>
    </div>
    
  );
};

export default Footer;
