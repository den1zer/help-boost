// client/src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Функція реєстрації
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('userToken', JSON.stringify(response.data.token));
    // Зберігаємо роль (при реєстрації вона завжди 'user')
    localStorage.setItem('userRole', response.data.role); 
  }
  return response.data;
};

// Функція входу
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('userToken', JSON.stringify(response.data.token));
     // Зберігаємо роль, яку повернув сервер
    localStorage.setItem('userRole', response.data.role);
  }
  // Повертаємо всі дані (тобто { token, role })
  return response.data; 
};

const authService = {
  register,
  login,
};

export default authService;