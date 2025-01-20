import axios from 'axios';
import apiClient from '../services/axiosConfig.js';


const API_URL = 'http://localhost:8080/api/auth';  // Replace with your backend URL

// Login function
export const login = (username, password) => {
    return apiClient.post(`${API_URL}/login`, { username, password })
      .then(response => {
        return response.data;  // Return the JWT token from the response
      })
      .catch(error => {
            // Capture and return error details for the component
        if (error.response) {
            // Backend responded with an error status code (4xx, 5xx)
            throw new Error(error.response.data.message || 'Login failed. Please try again.');
        } else if (error.request) {
            // No response received (network issues)
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Something else went wrong while setting up the request
            throw new Error('An unexpected error occurred.');
        }
      });
  };
  
  // Register function
  export const register = (email, username, password) => {
    return apiClient.post(`${API_URL}/register`, { email, username, password })
      .then(response => {
        return response.data;  // Return the response data (success message)
      })
      .catch(error => {
        throw error;  // Handle any errors from the API
      });
  };
