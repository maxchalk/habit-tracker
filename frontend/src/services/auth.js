import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials)
    return response.data
  }
}

// Token management
export const tokenManager = {
  // Save token to localStorage
  setToken: (token) => {
    localStorage.setItem('token', token)
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token')
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token')
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}