import React, { useState } from 'react';
import { login } from '../services/authService.js';
import { Button, TextField, Box, Typography, Container, Link, InputAdornment, IconButton  } from '@mui/material/index.js';
import loginPage from './login.jpg';
import './login.css';  // Custom CSS for layout adjustments
import ContactForm from '../components/contactComponent.js';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm = () => {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const data = await login(username, password);
        setMessage('Login Successful');
        localStorage.setItem('jwtToken', data.token);
        console.log('JWT Token:', data.token);
        window.location.href = '/dashboard';  // Redirect to dashboard
        } catch (error) {
        setMessage('Login Failed');
        console.error('Error during login:', error);
        }
    };

  return (
    <>
      <div className="outer-contact-container">
        <div className="login-left">
          <img src={loginPage} alt="Login" className="login-image" />
        </div>

        <Container className="sign-container">
          <Typography variant="h4" gutterBottom>
            Sign in
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            If you don't have an account,{' '}
            <Link href="/register" underline="none">
              Register here!
            </Link>
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '60%', mt: 4 }}>
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
              type={showPassword ? 'text' : 'password'}
              variant="standard"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
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
              Login
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

export default LoginForm;