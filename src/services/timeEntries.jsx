import axios from 'axios';
import { API_URL } from '../utils/constants';

const clockRecordsApi = axios.create({
 baseURL: `${API_URL}/clock-records`
});

export const setupClockRecordsInterceptor = (token) => {
 clockRecordsApi.interceptors.request.use(
   (config) => {
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   },
   (error) => Promise.reject(error)
 );
};

// Get all clock records (admin only)
export const getAllClockRecords = async (params = {}) => {
 try {
   const response = await clockRecordsApi.get('', { params });
   return response.data;
 } catch (error) {
   throw error;
 }
};

export const getMyClockRecords = async (params = {}) => {
 try {
   const response = await clockRecordsApi.get('/my-records', { params });
   return response.data;
 } catch (error) {
   throw error;
 }
};
 
export const createClockRecord = async (clockRecordData) => {
 try {
   const response = await clockRecordsApi.post('', clockRecordData);
   return response.data;
 } catch (error) {
   throw error;
 }
};
 
export const updateClockRecord = async (id, clockRecordData) => {
 try {
   const response = await clockRecordsApi.put(`/${id}`, clockRecordData);
   return response.data;
 } catch (error) {
   throw error;
 }
};
 
export const deleteClockRecord = async (id) => {
 try {
   const response = await clockRecordsApi.delete(`/${id}`);
   return response.data;
 } catch (error) {
   throw error;
 }
};
 
export const getSummaryRecord = async (period, startDate, endDate, userId = null) => {
 try {
   const params = {
     period,
     startDate,
     endDate,
     ...(userId && { userId })
   };
   
   const response = await clockRecordsApi.get('/summary', { params });
   return response.data;
 } catch (error) {
   throw error;
 }
};

export const getAllUsers = async () => {
 return []
}

export default clockRecordsApi;