import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3000/validate-session', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
        setIsAuthCheckComplete(true);
      })
      .catch(error => {
        console.error('Authentication check failed', error);
        setIsAuthenticated(false);
        setIsAuthCheckComplete(true);
      });
  }, []);

  if (!isAuthCheckComplete) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
