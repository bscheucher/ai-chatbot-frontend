import api from './api'

export const authService = {
  // Login user
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },

  // Register new user
  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  // Get current user
  getMe: () => {
    return api.get('/auth/me')
  },

  // Update user preferences
  updatePreferences: (preferences) => {
    return api.put('/auth/preferences', preferences)
  }
}