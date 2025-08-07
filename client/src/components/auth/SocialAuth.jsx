import React from 'react';
import { GoogleAuthProvider, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Button, Typography } from '@mui/material';
import { Google, LinkedIn } from '@mui/icons-material';
import '../../styles/SocialAuth.css';

const SocialAuth = () => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect or handle success
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      const provider = new OAuthProvider('linkedin.com');
      provider.addScope('r_liteprofile');
      provider.addScope('r_emailaddress');
      const result = await signInWithPopup(auth, provider);
      // Extract LinkedIn profile data
      const linkedInData = result.user.providerData[0];
      console.log('LinkedIn Data:', linkedInData);
      // You can now use this data to pre-fill the resume builder
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="social-auth-container">
      <Typography variant="body1" style={{ margin: '1rem 0', textAlign: 'center' }}>
        Or login with
      </Typography>
      
      <div className="social-buttons">
        <Button
          variant="outlined"
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          fullWidth
          style={{ marginBottom: '1rem', color: '#DB4437', borderColor: '#DB4437' }}
        >
          Continue with Google
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<LinkedIn />}
          onClick={handleLinkedInLogin}
          fullWidth
          style={{ color: '#0077B5', borderColor: '#0077B5' }}
        >
          Continue with LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;