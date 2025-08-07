// src/pages/OtpVerification.jsx
import React from 'react';
import { Button, TextField } from '@mui/material';

const OtpVerification = () => {
  return (
    <div>
      <h2>OTP Verification</h2>
      <TextField label="Enter OTP" fullWidth margin="normal" />
      <Button variant="contained">Verify OTP</Button>
    </div>
  );
};

export default OtpVerification;