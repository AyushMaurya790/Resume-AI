// Example callback component (src/pages/LinkedInCallback.jsx)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase/config';

const LinkedInCallback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const exchangeToken = async () => {
        try {
          const response = await fetch('YOUR_SERVER_ENDPOINT', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              redirect_uri: window.location.origin + '/linkedin-callback',
            }),
          });
          const { accessToken } = await response.json();
          const tokenResponse = await fetch('YOUR_SERVER_ENDPOINT/createCustomToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkedInAccessToken: accessToken }),
          });
          const { token } = await tokenResponse.json();
          await signInWithCustomToken(auth, token);
          navigate('/dashboard');
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      };
      exchangeToken();
    }
  }, [navigate]);
  return <div>Loading...</div>;
};

export default LinkedInCallback;