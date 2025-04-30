import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth'; // Backend API URL

// Register user
const register = (username, email, password) => {
  return axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
};

// Login user
const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};

// Get current user info
const getCurrentUser = (token) => {
  // Use Authorization header for Bearer token
  return axios.get(`${API_URL}/me`, { 
    headers: { 
      Authorization: `Bearer ${token}` 
    } 
  });
};

const authService = {
  register,
  login,
  getCurrentUser,
};

export default authService; 