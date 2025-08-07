import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../../firebase';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: '/builder', label: 'Resume Builder' },
    { path: '/templates', label: 'Templates' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="text-red">Resume</span>
          <span className="text-blue">AI</span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <Link to="/dashboard" className="btn-nav btn-blue">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-nav btn-outline">
                Log In
              </Link>
              <Link to="/signup" className="btn-nav btn-red">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="mobile-menu"
        initial={false}
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto' },
          closed: { opacity: 0, height: 0 }
        }}
        transition={{ duration: 0.3 }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            {link.label}
          </Link>
        ))}
        <div className="mobile-auth">
          {user ? (
            <Link to="/dashboard" className="btn-mobile btn-blue" onClick={toggleMenu}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-mobile btn-outline" onClick={toggleMenu}>
                Log In
              </Link>
              <Link to="/signup" className="btn-mobile btn-red" onClick={toggleMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;