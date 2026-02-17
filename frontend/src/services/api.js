import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const customer = JSON.parse(customerData);
      config.headers['X-Customer-ID'] = customer.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};

export const login = async (credentials) => {
    try {
        console.log('API: Sending login request to:', `${API_BASE_URL}/auth/login`);
        console.log('API: Request payload:', { email: credentials.email, password: '***' });
        
        const response = await api.post('/auth/login', credentials);
        
        console.log('API: Full response:', response);
        console.log('API: Response status:', response.status);
        console.log('API: Response data:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('API: Full error object:', error);
        console.error('API: Error response:', error.response);
        console.error('API: Error response status:', error.response?.status);
        console.error('API: Error response data:', error.response?.data);
        console.error('API: Error message:', error.message);
        
        throw error.response?.data || { message: 'Login failed' };
    }
};
// Customer endpoints
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);

// Account endpoints
export const createAccount = (customerId, accountData) => {
    console.log('API createAccount called with:', { customerId, accountData });
    return api.post(`/accounts/customer/${customerId}`, accountData);
};
export const getCustomerAccounts = (customerId) => 
  api.get(`/accounts/customer/${customerId}`);
export const getAccount = (accountNumber) => 
  api.get(`/accounts/${accountNumber}`);
export const deposit = (accountNumber, amount, description) => 
  api.post(`/accounts/${accountNumber}/deposit?amount=${amount}&description=${description || ''}`);
export const withdraw = (accountNumber, amount, pin, description) => 
  api.post(`/accounts/${accountNumber}/withdraw?amount=${amount}&pin=${pin}&description=${description || ''}`);
export const updateAccountStatus = (accountNumber, status) => 
  api.put(`/accounts/${accountNumber}/status?status=${status}`);

// Transaction endpoints
export const getTransactions = (accountNumber) => 
  api.get(`/transactions/account/${accountNumber}`);
export const getTransactionsByDateRange = (accountNumber, startDate, endDate) => 
  api.get(`/transactions/account/${accountNumber}/daterange?startDate=${startDate}&endDate=${endDate}`);
export const transferFunds = (fromAccount, toAccount, amount, pin, description) => 
  api.post(`/transactions/transfer?fromAccount=${fromAccount}&toAccount=${toAccount}&amount=${amount}&pin=${pin}&description=${description || ''}`);

// Statement endpoints
export const downloadStatement = (accountNumber, startDate, endDate) => 
  api.get(`/statements/${accountNumber}/pdf?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'blob'
  });

export default api;