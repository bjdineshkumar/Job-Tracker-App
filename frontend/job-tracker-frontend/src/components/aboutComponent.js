import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import aboutImage from './about.jpg';

const About = () => {
  return (
    <Container sx={{ marginTop: 4, padding: '10px' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Section: Text */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: '#FF5733',
                fontWeight: 'bold',
              }}
            >
              About
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ marginBottom: 2, color: '#555' }}
            >
              Subheading
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Lorem ipsum dolor sit amet consectetur. At ornare neque elit
              tincidunt sit viverra nullam. Nunc mauris feugiat scelerisque
              pretium faucibus id et nisl. Enim eget in accumsan nisi non enim
              accumsan. Adipiscing magna vulputate varius rhoncus enim. Aliquam
              massa massa pellentesque gravida ornare proin.
            </Typography>
            <Typography variant="body2" sx={{ color: '#777' }}>
              Ut at enim nec leo scelerisque hendrerit. Praesent ac sagittis
              nisl, at venenatis risus. Nam lacinia mauris non nunc tempor
              luctus. Duis vulputate diam felis, in condimentum libero
              convallis vel. In elementum risus ac ornare placerat. Nulla sit
              amet purus quis nibh suscipit feugiat non at magna.
            </Typography>
          </Box>
        </Grid>

        {/* Right Section: Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={aboutImage}
              alt="About"
              style={{
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
