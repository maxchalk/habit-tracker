import axios from 'axios'
import { tokenManager } from './auth'

// Create axios instance with default headers
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/reminders`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    console.log('API Interceptor - Token from localStorage:', token ? 'Found' : 'Not found')
    console.log('API Interceptor - Token value:', token)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('API Interceptor - Authorization header set:', config.headers.Authorization)
    } else {
      console.log('API Interceptor - No token available, request will fail')
    }
    return config
  },
  (error) => {
    console.error('API Interceptor - Request error:', error)
    return Promise.reject(error)
  }
)

export const reminderAPI = {
  // Get all reminders
  getReminders: async () => {
    console.log('getReminders - Making API call')
    const response = await apiClient.get('')
    return response.data
  },

  // Create a new reminder
  createReminder: async (reminder) => {
    const response = await apiClient.post('', reminder)
    return response.data
  },

  // Update a reminder
  updateReminder: async (id, reminder) => {
    const response = await apiClient.put(`/${id}`, reminder)
    return response.data
  },

  // Delete a reminder
  deleteReminder: async (id) => {
    const response = await apiClient.delete(`/${id}`)
    return response.data
  },

  // Toggle reminder completion
  toggleReminder: async (id) => {
    const response = await apiClient.patch(`/${id}/done`)
    return response.data
  }
}