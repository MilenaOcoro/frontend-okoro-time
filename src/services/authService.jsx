import { jwtDecode } from 'jwt-decode';
import { loginService, verifyTokenService } from './auth';
 
let currentUser = null;
let currentToken = localStorage.getItem('timeEntryToken') || null;
let listeners = [];
 
const notifyListeners = () => {
 listeners.forEach(listener => listener());
};
 
export const initAuth = async () => {
 if (currentToken) {
   try {
     const response = await verifyTokenService(currentToken);
     if (response) {
       const decoded = jwtDecode(currentToken);
       currentUser = {
         id: decoded.id,
         name: decoded.name,
         email: decoded.email,
         role: decoded.role
       };
     } else {
       logout();
     }
   } catch (error) {
     console.error('Error verifying token:', error);
     logout();
   }
 }
 notifyListeners();
 return !!currentUser;
};
 
export const login = async (credentials) => {
 try {
   const response = await loginService(credentials);
   const { token: newToken, name: userData } = response;
   
   localStorage.setItem('timeEntryToken', newToken);
   currentToken = newToken;
   currentUser = userData;
   
   notifyListeners();
   return { success: true, ...response };
 } catch (error) {
   console.error('Login error:', error);
   return { 
     success: false, 
     error: error.response?.data?.message || 'Login error' 
   };
 }
};
 
export const logout = () => {
 localStorage.removeItem('timeEntryToken');
 currentToken = null;
 currentUser = null;
 notifyListeners();
};
 
export const hasRole = (requiredRole) => {
 if (!currentUser) return false;
 return currentUser.role === requiredRole;
};
 
export const getAuthData = () => ({
 user: currentUser,
 token: currentToken,
 isAuthenticated: !!currentUser
});
 
export const subscribe = (callback) => {
 listeners.push(callback);
 return () => {
   listeners = listeners.filter(listener => listener !== callback);
 };
};