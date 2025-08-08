import React, { useState } from "react";
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Send OTP
  const sendOtp = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    // Backend API Call: POST /otp/send
    console.log("OTP sent to:", email);
    setIsOtpSent(true);
  };

  // Verify OTP
  const verifyOtp = () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    // Backend API Call: POST /otp/verify
    console.log("OTP verified:", otp);
    alert("Login successful!");
  };

  return (
    <div className="login-container">
      <h2>ResumeAI - Login</h2>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isOtpSent}
      />

      {/* Send OTP Button */}
      {!isOtpSent && (
        <button onClick={sendOtp} className="btn-primary">
          Send OTP
        </button>
      )}

      {/* OTP Input */}
      {isOtpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="btn-success">
            Login
          </button>
        </>
      )}

      {/* Social Login */}
      <div className="social-login">
        <button className="btn-google">Login with Google</button>
        <button className="btn-linkedin">Login with LinkedIn</button>
        <button className="btn-guest">Guest Mode</button>
      </div>
    </div>
  );
};

export default Login;
