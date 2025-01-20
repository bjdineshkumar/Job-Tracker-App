import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        height: '350px', // Set AppBar height
        backgroundColor: '#f5f5f5', // Light gray background
      }}
    >
      <Toolbar
        sx={{
          height: '100%', // Ensures Toolbar takes full height of AppBar
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center content vertically
          textAlign: 'center', // Center text
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            fontSize: '2.5rem',
            marginBottom: 1,
            color: '#000',
          }}
        >
          Welcome to <span style={{ color: '#FF5733' }}>Job Tracker</span>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: 3, fontSize: '1.2rem', color: '#555' }}
        >
          One stop shop for all your job applications
        </Typography>

        {/* Buttons */}
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#007bff',
              color: '#fff',
              marginRight: 1,
              padding: '0.5rem 1.5rem',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#0056b3' },
            }}
          >
            Contact
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FF5733',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#C4442A' },
            }}
          >
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
