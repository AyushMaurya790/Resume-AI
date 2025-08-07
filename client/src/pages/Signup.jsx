// src/pages/Signup.jsx
import React from 'react';
import { Button, TextField } from '@mui/material';

const Signup = () => {
  return (
    <div>
      <h2>Signup</h2>
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained">Signup</Button>
    </div>
  );
};

export default Signup;