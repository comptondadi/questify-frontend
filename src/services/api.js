// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000', // Your FastAPI server URL
});

apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful (status 2xx), just return it.
    return response;
  },
  (error) => {
    // If the response has an error (status 4xx or 5xx)
    if (error.response && error.response.status === 401) {
      // Specifically check if the error is a 401 Unauthorized
      console.log('Authentication token expired or invalid. Logging out.');
      
      // Remove the bad token from storage
      localStorage.removeItem('accessToken');
      
      // Redirect the user to the login page.
      // We use window.location.href to force a full page reload, which
      // is a simple and effective way to reset the application's state.
      window.location.href = '/'; 
    }
    
    // For all other errors, just pass them along.
    return Promise.reject(error);
  }
);
export default apiClient;