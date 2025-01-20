import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL
  withCredentials: true,           // Include credentials (cookies) in cross-origin requests
});

export default apiClient;