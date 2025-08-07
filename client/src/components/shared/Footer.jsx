import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="text-red">Resume</span>
            <span className="text-blue">AI</span>
          </Link>
          <p className="footer-tagline">
            AI-powered resume builder for the modern job seeker
          </p>
        </div>

        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-title">Product</h3>
            <ul className="footer-links">
              <li><Link to="/builder">Resume Builder</Link></li>
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/examples">Resume Examples</Link></li>
              <li><Link to="/career-advice">Career Advice</Link></li>
              <li><Link to="/ats-guide">ATS Guide</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Connect</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            </div>
            <div className="newsletter">
              <p>Subscribe to our newsletter</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button className="btn-red">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} ResumeAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;