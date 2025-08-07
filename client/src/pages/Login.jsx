// src/pages/Login.jsx
import React from 'react';
import { Button, TextField } from '@mui/material';

const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained">Login</Button>
    </div>
  );
};

export default Login;