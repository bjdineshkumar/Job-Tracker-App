import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
} from '@mui/material/index.js';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './Logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles/index.js';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
    },
    secondary: {
      main: '#4880FF',
    },
  },
});

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in by looking for a JWT token
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');  // Check localStorage for token
    setIsLoggedIn(!!token);  // Set to true if token exists
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('jwtToken');  // Remove token from storage
    setIsLoggedIn(false);  // Update state
    navigate('/');  // Redirect to the home page
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="white">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <img src={logo} alt="App Logo" style={{ height: 50 }} />
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" href="/">Resources</Button>
            <Button color="inherit" href="/">About</Button>
            <Button color="inherit" href="/">Contact</Button>
            {isLoggedIn ? (
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button variant="contained" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose} component="a" href="/">Resources</MenuItem>
        <MenuItem onClick={handleMenuClose} component="a" href="/">About</MenuItem>
        <MenuItem onClick={handleMenuClose} component="a" href="/">Contact</MenuItem>
        {isLoggedIn ? (
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
        ) : (
          <>
            <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>Sign in</MenuItem>
            <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }}>Register</MenuItem>
          </>
        )}
      </Menu>
    </ThemeProvider>
  );
};

export default Header;
