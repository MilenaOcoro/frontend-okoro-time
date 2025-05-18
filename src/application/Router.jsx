import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import * as authService from '../services/authService';


import LoginPage from '../pages/LoginPage/LoginPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import DashboardAdminPage from '../pages/DashboardAdminPage/DashboardAdminPage';
import TimeEntriesPage from '../pages/TimeEntriesPage/TimeEntriesPage';
import UsersPage from '../pages/UsersPage/UsersPage';   
import AccessDenied from '../pages/AccessDenied/AccessDenied';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'; 

const Router = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    
    const init = async () => {
      await authService.initAuth();
      setInitialized(true);
    };
    
    init();
  }, []);
  
  if (!initialized) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }
  
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path='/access-denied' element={<AccessDenied />} />
          <Route path='/register-user' element={<RegisterPage />} /> 
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboardAdmin" element={<DashboardAdminPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/time-entries" element={<TimeEntriesPage />} />
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;