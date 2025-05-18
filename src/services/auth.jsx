import axios from 'axios';
import { API_URL } from '../utils/constants';
import { setupClockRecordsInterceptor } from './timeEntries';
import { setupUsersInterceptor } from './users';
 
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});
 
export const setupAuthInterceptor = (token) => {
  authApi.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};
 
export const loginService = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const verifyTokenService = async (token) => {
  try {
    setupAuthInterceptor(token);
    setupClockRecordsInterceptor(token);
    setupUsersInterceptor(token);
    const response = await authApi.get('/verify');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export default authApi;