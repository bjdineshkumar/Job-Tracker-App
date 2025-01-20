import React from 'react';
import { Box, Typography, Card, CardContent, Grid2 } from '@mui/material';
import ContactForm from '../components/contactComponent.js';

const features = [
  { title: 'Job Tracking', description: 'Description' },
  { title: 'Integration', description: 'Description' },
  { title: 'Analytic Dashboard', description: 'Description' },
  { title: 'Notifications', description: 'Description' },
  { title: 'Resume Parsing', description: 'Description' },
];

const Features = () => {
  return (
    <>
      <Box
        sx={{
          padding: 4,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Centers content vertically
          alignItems: 'center', // Centers content horizontally
          textAlign: 'center', // Ensures text is centered
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: '#FF5733',
            fontWeight: 'bold',
          }}
        >
          Features
        </Typography>

        {/* Subtitle */}
        <Typography variant="subtitle1" sx={{ marginBottom: 4 }}>
          Hooray! Look at what we have
        </Typography>

        {/* Features Grid */}
        <Grid2
          container
          spacing={3}
          sx={{
            justifyContent: 'center', // Centers the grid horizontally
            alignItems: 'center', // Centers items vertically (optional)
            maxWidth: '1200px', // Limits the grid width
          }}
        >
          {features.map((feature, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: '#212121',
                  color: 'white',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
                  '&:hover': {
                    transform: 'scale(1.05)', // Slightly enlarge the card
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Add a shadow effect
                    backgroundColor: '#333333', // Change background color
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: '#FF5733',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Contact Form */}
      <ContactForm />
    </>
  );
};

export default Features;
