import React from 'react';
import './contact.css'; // Import the CSS file
import logo from './contact.jpg'
import Box from '@mui/material/Box/index.js';
import TextField from '@mui/material/TextField/index.js';
import Button from '@mui/material/Button/index.js';
import { createTheme } from '@mui/material/styles/index.js';
import { ThemeProvider } from '@emotion/react';
import Typography from '@mui/material/Typography/index.js';
import Container from '@mui/material/Container/index.js';

const theme = createTheme({
    palette: {
      primary: {
        main: '#FF5733',
      },
      secondary: {
        main: '#4880FF',
        light: '#F5EBFF',
        contrastText: '#FFFFFF',
      },
    },
  });

const ContactForm = () => {
    
  return (
    <Container>
        <ThemeProvider theme={theme}>
        <div className="outer-contact-container">
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, paddingRight: '20px', whiteSpace: 'nowrap'}}>
            <Typography variant="h3" gutterBottom color='primary'>
              Contact Us
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Get in touch with us
            </Typography>
          </Box>
        <div className="contact-container">
        <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '35ch', paddingRight: '20px' } }}
      noValidate
      autoComplete="off"
        >
        <TextField
          required
          id="outlined-required"
          label="Name"
          defaultValue="Value"
        />
        <TextField
          required
          id="outlined-required"
          label="Surname"
          defaultValue="Value"
        />
        <TextField
          required
          id="outlined-required"
          label="Email"
          defaultValue="Value"
        />
        <TextField
          id="outlined-multiline-static"
          label="Message"
          multiline
          rows={4}
          defaultValue="Value"
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
            variant="contained"
            color="primary"
            sx={{
                width: { xs: '100%', sm: '60%' },
                maxWidth: '320px', 
                mt: 2, 
            }}
            >
            Submit
            </Button>
        </Box>
    </Box>
      </div>
    <Box sx={{ width: '100%', maxWidth: 700 }}>
        <div className="contact-right">
              <img src={logo} alt="Contact Us" />
        </div>
    </Box>
    </div>
    </ThemeProvider>
    </Container>
    

  );
};

export default ContactForm;
