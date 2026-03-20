// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  // If there is no token in localStorage, redirect the user to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If there is a token, render the component that was passed in (e.g., the Dashboard)
  return children;
};

export default ProtectedRoute;