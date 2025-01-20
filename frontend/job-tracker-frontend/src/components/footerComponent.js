import React from 'react';
import { Box, Typography } from '@mui/material';
import './footerComponent.css';

const Footer = () => {
  return (
    <Box className="footer-container">
      <Typography variant="body2" color="textSecondary" className="footer-left">
        © 2024 Job Tracker Application. All Rights Reserved
      </Typography>
      <Typography variant="body2" color="textSecondary" className="footer-right">
        contactus@gmail.com
      </Typography>
    </Box>
  );
};

export default Footer;