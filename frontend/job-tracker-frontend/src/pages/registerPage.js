import React, { useState } from 'react';
import { register } from '../services/authService.js';  // Import the register function
import { Button, TextField, Box, Typography, Container, Link, InputAdornment, IconButton } from '@mui/material/index.js';
import ContactForm from '../components/contactComponent.js';
import registerPage from './registerPage.jpg';
import './registerPage.css'; 
import AccountCircle from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the register service
      const data = await register(email, username, password);
      setMessage('Registration Successful');
      console.log('User Registered:', data);
    } catch (error) {
      setMessage('Registration Failed');
      console.error('Error during registration:', error);
    }
  };

  return (
    <>
      <div className="outer-contact-container">
        <div className="login-left">
          <img src={registerPage} alt="Login" className="register-image" />
        </div>

        <Container className="sign-container">
          <Typography variant="h4" gutterBottom>
            Sign up
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            If you already have an account registered,{' '}
            <Link href="/login" underline="none">
              Login here!
            </Link>
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '60%', mt: 4 }}>
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Username"
              variant="standard"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your user name"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              variant="standard"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>

          {message && (
            <Typography
              color={message === 'Login Successful' ? 'success.main' : 'error.main'}
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </Container>
      </div>
      <ContactForm />
    </>
  );
};

export default RegisterForm;
