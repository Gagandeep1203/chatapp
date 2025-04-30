import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, redirect to the home/chat page
  // Otherwise, render the child route component (Login/Register)
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute; 