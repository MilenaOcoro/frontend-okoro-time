import axios from 'axios';
import { API_URL } from '../utils/constants';

const usersApi = axios.create({
 baseURL: `${API_URL}/users`
});

export const setupUsersInterceptor = (token) => {
 usersApi.interceptors.request.use(
   (config) => {
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   },
   (error) => Promise.reject(error)
 );
};
 
export const getAllUsers = async () => {
 try {
   const response = await usersApi.get('');
   return response.data;
 } catch (error) {
   throw error;
 }
};

export const getUserById = async (id) => {
 try {
   const response = await usersApi.get(`/${id}`);
   return response.data;
 } catch (error) {
   throw error;
 }
};

export const createUser = async (userData) => {
 try {
   const response = await usersApi.post('', userData);
   return response.data;
 } catch (error) {
   throw error;
 }
};
 
export const updateUser = async (id, userData) => {
 try {
   const response = await usersApi.put(`/${id}`, userData);
   return response.data;
 } catch (error) {
   throw error;
 }
};
 
export const deleteUser = async (id) => {
 try {
   const response = await usersApi.delete(`/${id}`);
   return response.data;
 } catch (error) {
   throw error;
 }
};

export const changePassword = async (oldPassword, newPassword) => {
 try {
   const response = await usersApi.post('/change-password', {
     oldPassword,
     newPassword
   });
   return response.data;
 } catch (error) {
   throw error;
 }
};

export default usersApi;