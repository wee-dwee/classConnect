import React from 'react';
import './contactus.css';
import Footer1 from './Footer1.js';
import Navbar from './Navbar.js';
import { useParams, useHistory } from "react-router-dom";

export default function ContactUs({username}) {
  const { profileId } = useParams();
  return (
    <>
    <Navbar username={username} profileId={profileId}/>
      <section className="contact" id="contact">
      <div className="container">
        <div className="heading text-center">
          <h2>Contact Us</h2>

          <p>Have questions or need assistance? We're here to help! Feel free to reach out to us via email at classConnect@gmail.com. Our support team strives to respond to all inquiries promptly and ensure that your concerns are addressed effectively.

Thank you for choosing ClassConnect, for your online learning needs. We look forward to supporting you on your educational journey!


          </p>
        </div>
        <div className="row">
          <div className="col-md-5">
            <div className="title">
              <h3>Contact detail</h3>
              {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor </p> */}
            </div>
            <div className="content">
              {/* Info-1 */}
              <div className="info">
                <i className="fas fa-mobile-alt" />
                <h4 className="d-inline-block">PHONE :
                  <br />
                  <span>+918160004051 , +917265068992</span></h4>
              </div>
              {/* Info-2 */}
              <div className="info">
                <i className="far fa-envelope" />
                <h4 className="d-inline-block">EMAIL :
                  <br />
                  <span> classConnect@gmail.com</span></h4>
              </div>
              {/* Info-3 */}
              <div className="info">
                <i className="fas fa-map-marker-alt" />
                <h4 className="d-inline-block">ADDRESS :<br /></h4>
                <h4> Dhirubhai Ambani Institute of Information and Communication Technology, Near Indroda Circle, Gandhinagar - 382 007, Gujarat (India)</h4>
              </div>
            </div>
          </div>
          <div className="col-md-7">

            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.4972641895024!2d72.6263405749077!3d23.18854191011498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2a3c9618d2c5%3A0xc54de484f986b1fa!2sDA-IICT!5e0!3m2!1sen!2sin!4v1699774054316!5m2!1sen!2sin"
              width="100%" height="100%"
              style={{ border: "0" }} allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>

          </div>
        </div>
      </div>
    </section>
    <Footer1 />
    </>
    
  )
}
