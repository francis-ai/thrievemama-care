import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../assets/css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/faq">FAQs</a></li>
          <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
        </ul>
      </nav>
      <hr></hr>
      <div className="footer-top">
      <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/waiting-list">Hire a Caregiver</Link></li>
            <li><Link to="/waiting-list">Become a Caregiver</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Find Jobs</h3>
          <ul>
            <li>Nanny Jobs</li>
            <li>Caregiver Jobs</li>
            <li>Part-time Opportunities</li>
            <li>Live-in Roles</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@thrivemama.com</p>
          <p>Phone: +234 123 456 7890</p>
        </div>
      </div>
      <div className="footer-socials">
        <FaFacebookF />
        <FaTwitter />
        <FaInstagram />
        <FaLinkedinIn />
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} ThriveMama. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
