import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns a 401 Unauthorized, we might want to redirect to login
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access. Please login again.');
      // Add logic to clear auth state or redirect if necessary
    }
    return Promise.reject(error);
  }
);

export default api;
