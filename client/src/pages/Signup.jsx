import React, { useState } from "react";
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    // Backend API call yaha hoga
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>ResumeAI - Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="btn-google">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
          Sign up with Google
        </button>

        <button className="btn-linkedin">
          <img src="https://www.svgrepo.com/show/157006/linkedin.svg" alt="LinkedIn" />
          Sign up with LinkedIn
        </button>

        <button className="btn-otp">Sign up with OTP</button>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
