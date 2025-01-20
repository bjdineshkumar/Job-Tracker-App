import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography/index.js';
import WorkIcon from '@mui/icons-material/Work';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import apiClient from '../services/axiosConfig.js';
import jtLogo from './jobtrackertitleimagetransparent.png';
import profileIcon from './profile-user.png';
import JobTable from '../components/jobTable.js'; 
import ResumeAnalyzer from './resumeAnalyzerPage.js'; 
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress/index.js';



import './dashboard.css'; 

const NAVIGATION = [
  { path: '/dashboard', segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/integrations', segment: 'integrations', title: 'Integration', icon: <ShoppingCartIcon /> },
  { path: '/resumeparsing', segment: 'resumeparsing', title: 'Resume Parsing', icon: <FindInPageIcon /> },
  { path: '/jobpostings', segment: 'jobpostings', title: 'Job Postings', icon: <WorkIcon /> },
  { path: '/jobtracking', segment: 'jobtracking', title: 'Job Tracking', icon: <WorkIcon /> },
  { kind: 'divider' },
  { path: '/calendar', segment: 'calendar', title: 'Calendars', icon: <BarChartIcon /> },
  { path: '/todo', segment: 'todo', title: 'To-Do', icon: <LayersIcon /> },
];

// Fetch user profile from the backend
const fetchUserProfile = async (token) => {
  try {
    const response = await apiClient.get('http://localhost:8080/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

function DemoPageContent({ pathname }) {
  switch (pathname) {
    case '/jobtracking':
      return (
        <div className="job-table-container">
          <Typography variant='h3' className="page-heading">Job Tracking</Typography>
          <JobTable />
        </div>
      );
    case '/resumeparsing':
      return (
        <div className="content-section">
          <Typography variant='h3' className="page-heading">Resume Parsing</Typography>
          <ResumeAnalyzer />
        </div>
      );
    case '/dashboard':
      return (
        <div className="content-section">
          <Typography className="page-heading">Dashboard</Typography>
          <Typography>This is the main dashboard content.</Typography>
        </div>
      );
    default:
      return (
        <div className="content-section">
          <Typography className="page-heading">Page Not Found</Typography>
          <Typography>The page {pathname} does not exist.</Typography>
        </div>
      );
  }
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccount() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const signIn = async (token) => {
    try {
      const userProfile = await fetchUserProfile(token);
      if (userProfile) {
        setSession({
          user: {
            name: userProfile.username,
            email: userProfile.email,
            image: profileIcon,
          },
        });
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setSession(null);
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      signIn(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <AppProvider
      session={session}
      authentication={{ signIn, signOut }}
      navigation={NAVIGATION}
      branding={{
        logo: <img src={jtLogo} alt="JT Logo" />,
        title: '',
      }}
    >
      <DashboardLayout className="dashboard-layout-container">
        <DemoPageContent pathname={location.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutAccount;

