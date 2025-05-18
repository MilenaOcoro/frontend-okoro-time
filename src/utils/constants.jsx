export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const ROLES = {
 ADMIN: 'ADMIN',
 USER: 'USER'
};

export const TIME_ENTRY_TYPES = {
 CLOCK_IN: 'clock_in',
 CLOCK_OUT: 'clock_out'
};

export const SUMMARY_PERIODS = {
 DAY: 'dia',
 WEEK: 'semana',
 MONTH: 'mes'
};

export const ERROR_MESSAGES = {
 LOGIN: 'Login error. Check your credentials.',
 REGISTRATION: 'Error registering user. Try with another email.',
 DATA_LOADING: 'Error loading data. Please try again.',
 TIME_ENTRY: 'Error recording clock record.',
 PERMISSIONS: 'You do not have permission to perform this action.',
 CONNECTION: 'Connection error with the server.',
 UNKNOWN: 'An unexpected error has occurred. Please try again.'
};

export const DATE_FORMAT = {
 COMPLETE: 'DD/MM/YYYY HH:mm',
 DATE: 'DD/MM/YYYY',
 TIME: 'HH:mm',
 API_DATE: 'YYYY-MM-DD',
 API_TIME: 'HH:mm:ss'
};

export const TIME_ENTRY_STATUS = {
 PENDING: 'pending',
 APPROVED: 'approved',
 REJECTED: 'rejected'
};

export const THEMES = {
 LIGHT: 'light',
 DARK: 'dark'
};

export default {
 API_URL,
 ROLES,
 TIME_ENTRY_TYPES,
 SUMMARY_PERIODS,
 ERROR_MESSAGES,
 DATE_FORMAT,
 TIME_ENTRY_STATUS,
 THEMES
};