import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Button, Input, Card, Typography } from '@mui/material';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/complete-signin`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setOtpSent(true);
      alert('OTP sent to your email!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" elevation={6}>
        <Typography variant="h4" className="auth-title" style={{ color: '#1976d2' }}>
          ResumeAI Login
        </Typography>
        
        {!otpSent ? (
          <form onSubmit={handleEmailLogin} className="auth-form">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              style={{ marginBottom: '1rem' }}
            >
              {loading ? 'Logging in...' : 'Login with Email'}
            </Button>
            
            <Button
              onClick={handleOTPLogin}
              variant="outlined"
              color="secondary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Sending...' : 'Login with OTP'}
            </Button>
          </form>
        ) : (
          <div className="otp-verification">
            <Typography variant="body1" style={{ marginBottom: '1rem' }}>
              Enter the OTP sent to {email}
            </Typography>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                // Verify OTP logic here
                navigate('/dashboard');
              }}
            >
              Verify OTP
            </Button>
          </div>
        )}
        
        <div className="auth-footer">
          <Typography variant="body2">
            Don't have an account? <a href="/signup" style={{ color: '#d32f2f' }}>Sign up</a>
          </Typography>
          <Typography variant="body2">
            <a href="/forgot-password" style={{ color: '#1976d2' }}>Forgot password?</a>
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default Login;