/**
 * authService.js
 * Service for authentication API calls
 */
import api from './api';

// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

// Update profile
const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  
  if (response.data) {
    // Update user data in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...user,
      ...response.data.data,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  return response.data.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.post('/auth/change-password', passwordData);
  return response.data;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authService;