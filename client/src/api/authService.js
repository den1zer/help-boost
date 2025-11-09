import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('userToken', JSON.stringify(response.data.token));
    localStorage.setItem('userRole', response.data.role); 
    localStorage.setItem('userId', JSON.stringify(response.data.userId)); 
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('userToken', JSON.stringify(response.data.token));
    localStorage.setItem('userRole', response.data.role);
    localStorage.setItem('userId', JSON.stringify(response.data.userId)); 
  }
  return response.data; 
};

const authService = {
  register,
  login,
};

export default authService;