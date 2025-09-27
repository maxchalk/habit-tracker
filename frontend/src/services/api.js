import axios from 'axios'

const API_URL = '/api/reminders'

export const reminderAPI = {
  // Get all reminders
  getReminders: async () => {
    const response = await axios.get(API_URL)
    return response.data
  },

  // Create a new reminder
  createReminder: async (reminder) => {
    const response = await axios.post(API_URL, reminder)
    return response.data
  },

  // Update a reminder
  updateReminder: async (id, reminder) => {
    const response = await axios.put(`${API_URL}/${id}`, reminder)
    return response.data
  },

  // Delete a reminder
  deleteReminder: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  },

  // Toggle reminder completion
  toggleReminder: async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/done`)
    return response.data
  }
}