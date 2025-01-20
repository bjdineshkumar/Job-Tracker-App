import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the 'code' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Send the code to the backend for token exchange
      fetch(`http://localhost:8080/oauth2callback?code=${code}`)
        .then(response => {
          if (response.ok) {
            // Redirect to Job Tracking after successful processing
            navigate('/jobtracking');
          } else {
            throw new Error('Backend error during OAuth.');
          }
        })
        .catch(error => {
          console.error('Error during OAuth callback:', error);
          alert('Authentication failed. Please try again.');
          navigate('/login'); // Redirect to login on failure
        });
    } else {
      console.error('No code found in URL');
      alert('Authentication failed: No code found in URL.');
      navigate('/login'); // Redirect to login on failure
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default OAuthRedirectHandler;
