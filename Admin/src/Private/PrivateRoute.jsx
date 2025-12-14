import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Clean up URL
      const newUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const token = localStorage.getItem('token');

  // If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  // If there is a token, render the children (protected route)
  return children;
};

export default PrivateRoute;
