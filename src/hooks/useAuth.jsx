
import { useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const useAuth = () => {
  const [authData, setAuthData] = useState(authService.getAuthData());
  
  useEffect(() => { 
    
    authService.initAuth();
     
    const unsubscribe = authService.subscribe(() => {
      setAuthData(authService.getAuthData());
    });
    
    return unsubscribe;
  }, []);
  
  return {
    ...authData,
    login: authService.login,
    logout: authService.logout,
    hasRole: authService.hasRole,
    loading: false 
  };
};

export default useAuth;