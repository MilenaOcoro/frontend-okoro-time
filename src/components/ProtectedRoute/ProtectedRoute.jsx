import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import * as authService from '../../services/authService';
import './ProtectedRoute.css';

const ProtectedRoute = ({ requiredRole, redirectTo = '/login' }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      
      await authService.initAuth();
      const { isAuthenticated } = authService.getAuthData();
      setIsAuth(isAuthenticated);
      
      if (requiredRole) {
        setHasRequiredRole(authService.hasRole(requiredRole));
      } else {
        setHasRequiredRole(true);
      }
      
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [requiredRole]);
  
  if (!authChecked) {
    return (
      <div className="protected-route">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  
  if (!isAuth) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/access-denied" replace />;
  }
  
  return <div className="protected-route"><Outlet /></div>;
};

export default ProtectedRoute;