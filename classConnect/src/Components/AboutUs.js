import React , { useState } from 'react'
import './aboutUs.css';
import campus from './campus-1.png';
import img1 from './access_time.svg'
import img2 from './campus.svg'
import img3 from './jobs-1.svg'
import img4 from './mobile.svg'
import img5 from './database.svg'
import img6 from './security.svg'
import img7 from './img7.png'
import img8 from './img8.png'
import img9 from './img9.png'
import img10 from './img10.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileCard from './ProfileCard';
import Footer1 from './Footer1';
import Navbar from './Navbar';
import { useParams, useHistory } from "react-router-dom";

const slides = [
  
];

const AboutUs = ({username}) => {
  const [index, set] = useState(0);
  const { profileId } = useParams();

  const profiles = [
    {
      name: 'Vinit Mehta',
      username: 'Web Developer',
      imageSrc: img7,
      socialLinks: [
        {url: 'https://www.linkedin.com/in/vinit-mehta-5a7b98251/' },
      ],
    },
    {
      name: 'Dweej Pandya',
      username: 'Web Developer',
      imageSrc: img10,
      socialLinks: [
        {url: 'https://www.linkedin.com/in/dweej-pandya-14936b249?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
      ],
    },
    {
      name: 'Aarsh Bhavsar',
      username: 'Web Developer',
      imageSrc: img8,
      socialLinks: [
        {url: 'https://www.linkedin.com/in/aarsh-b-9a06a7226?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
      ],
    },
    {
      name: 'Sankalp Bohidar',
      username: 'Web Developer',
      imageSrc: img9,
      socialLinks: [ 
        {url: 'http://www.linkedin.com/in/sankalp-bohidar-518193158' }
      ],
    }

  ];


  return (

    <>
    <Navbar username={username} profileId={profileId}/>
    <div>
      <div class="a">
      <h1>Bridging Dreams with Careers</h1>
      <p>At DA-IICT, we believe in fostering excellence in education and empowering our students to achieve their full potential. We are committed to providing a world-class learning environment that nurtures innovation, creativity, and problem-solving skills.
      </p>
  </div>

    <div class="main-content">
      <h2 className="Aboutheading">About DA-IICT</h2>
      <p>DA-IICT is a premier institution of higher education dedicated to the Information and Communication Technology. Established by the Reliance Group, DA-IICT is widely recognized for its academic rigor, cutting-edge research, and strong industry connections.</p>

      <p>The university offers a comprehensive range of undergraduate, postgraduate, and doctoral programs in the fields of computer science, electronics and communication engineering, and information technology. Our curriculum is designed to meet the evolving needs of the industry, ensuring that our graduates are equipped with the skills and knowledge to succeed in a dynamic and competitive global marketplace.</p>

      <p>DA-IICT is proud of its strong placement record, with graduates consistently securing coveted positions in leading multinational corporations and start-ups. Our Placement Cell actively collaborates with industry partners to provide our students with valuable internship opportunities and access to the latest industry trends.</p>

      <p>Beyond academics, DA-IICT fosters a vibrant campus life that encourages students to explore their interests and participate in a variety of extracurricular activities. Our students are actively involved in research, community engagement, and student organizations, gaining valuable experience that enriches their overall learning experience.</p>

      <p>If you are seeking a challenging and rewarding academic journey that will prepare you for a successful career in the technology industry, DA-IICT is the ideal place for you. Join us and embark on a journey of innovation, collaboration, and personal growth.</p>

      <h2 className="Aboutheading">Our Programs</h2>
      <div class="imagec">
        <img src={img2} alt="DA-IICT Campus Life" className='img2'></img>
      </div>

      <p>DA-IICT offers a diverse range of undergraduate and postgraduate programs in the field of Information and Communication Technology. Our programs are designed to provide students with a strong foundation in the latest theoretical and practical advancements in the field.</p>

      <h3 className="Aboutheading">Undergraduate Programs</h3>
      <ul className="ulh">
        <li className="lih">B.Tech. (Information and Communication Technology)</li>
        <li className="lih">B.Tech. (ICT with minors in Computational Science)</li>
      </ul>
    </div>

      <div className='d'>
      Your future is our priority. Join DA-IICT for a world of opportunities and Gujarat's unrivaled placements.
      </div>

      <div className='e'>
        We are a team of passionate students from DAIICT College, embarking on this software project which uses MERN stack. While we may not have years of professional experience, we are enthusiastic and dedicated to delivering a great product.
      </div>


      <div className='f'>

        <div className='card1'>
          <img src={img1} alt="img1" className='img1'></img>
          <h3 className='title'>
            <b>  Use Anytime: </b>
          </h3>
          <p className='disc'>Our website is accessible 24/7. Whether you're an early bird or a night owl, you can access valuable insights whenever it suits you.</p>
        </div>


        <div className='card1'>
          <img src={img2} alt="img1" className='img1'></img>
          <h3 className='title'>
            <b>  User Friendly Interface: </b>
          </h3>
          <p className='disc'>The website is easy to navigate for both employers and candidates. Intuitive design and clear navigation menus enhances the user experience</p>
        </div>


        <div className='card1'>
          <img src={img3} alt="img1" className='img1'></img>
          <h3 className='title'>
            <b> Class Listings:  </b>
          </h3>
          <p className='disc'>Comprehensive class listings with clear and detailed descriptions. One can get more information once they are entered in class.</p>
        </div>


        <div className='card1'>
          <img src={img4} alt="img1" className='img1'></img>
          <h3 className='title'>
            <b> Mobile Responsiveness: </b>
          </h3>
          <p className='disc'> The website is mobile-friendly to accommodate users accessing it from various devices.</p>
        </div>


        <div className='card1'>
          <img src={img5} alt="img1" className='img1'></img>
          <h3 className='title'>
            <b> MongoDB Database: </b>
          </h3>
          <p className='disc'> MongoDB is a NoSQL database known for its flexibility, scalability, and ease of use in handling large volumes of data.</p>
        </div>



        <div className='card1'>
          <img src={img6} alt="img1" className='img1'></img>
          <h3 className='title'>
            <b> Security and Privacy: </b>
          </h3>
          <p className='disc'>The security of user data is clearly communicated and prioritized. Secure login and data encryption protocols are implemented.</p>
        </div>
      </div>



      <div className='g'>
        Our Team Members
        </div>


      <div className='h'>

      <section className="vh-400">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          {profiles.map((profile, index) => (
            <ProfileCard key={index} {...profile} />
          ))}
        </div>
      </div>
    </section>



      </div>





    </div>
    <Footer1 />
    </>
    
  );
};

export default AboutUs;
