import React, { useEffect, useState } from 'react';
import './Footer3.css';

const Footer = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;

      setIsSticky(bodyHeight < windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={isSticky ? "foo3-sticky" : "foo3"}>
      <footer className="footer3">
        <p>&copy; Copyright : ClassConnect by ProjectDAVS</p>
      </footer>
    </div>
  );
};

export default Footer;
