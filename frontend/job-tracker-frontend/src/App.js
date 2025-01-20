import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Login from './pages/loginPage.js';
import Register from './pages/registerPage.js';
import Header from './components/headerComponent.js'; // Existing Header
import LandingPageHeader from './components/welcomeHeading.js'; // New Landing Page Header
import About from './components/aboutComponent.js';
import Features from './components/featuresComponent.js';
import ProtectedRoute from './components/protectedRoute.js';
import Dashboard from './pages/dashboardPage.js';
import Footer from './components/footerComponent.js';
import OAuthRedirectHandler from './components/OAuthRedirectHandler.js';
import StartOAuth from './components/StartOAuth.js';
import ResumeAnalyzer from "./pages/resumeAnalyzerPage.js";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

// Separate the main content into a child component
function MainApp() {
  const location = useLocation(); // Hook to get the current route location

  // Determine if the header should be shown
  const shouldShowHeader = !['/dashboard', '/jobtracking','/resumeparsing'].includes(location.pathname);

  return (
    <>
      {/* Show Header only if not on Dashboard */}
      {shouldShowHeader && location.pathname !== '/' && <Header />}
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <LandingPageHeader />
              <About />
              <Features />
            </>
          }
        />

        {/* OAuth Start and Redirect Handling */}
        <Route path="/start-oauth" element={<StartOAuth />} />
        <Route path="/oauth-redirect" element={<OAuthRedirectHandler />} />

        {/* Login, Register, and Dashboard Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobtracking" element={<Dashboard />} />
          <Route path="/resumeparsing" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
