import React, { useEffect } from 'react';

const StartOAuth = () => {
  useEffect(() => {
    // Fetch the OAuth URL from the backend and redirect
    fetch('http://localhost:8080/start-oauth')
      .then((response) => response.json())
      .then((data) => {
        if (data.authUrl) {
          window.location.href = data.authUrl; // Redirect to Google's OAuth page
        } else {
          console.error('Authorization URL is not available.');
        }
      })
      .catch((error) => {
        console.error('Error initiating OAuth:', error);
        alert('Failed to start OAuth. Please try again.');
      });
  }, []);

  return <div>Redirecting to Google for authentication...</div>;
};

export default StartOAuth;
