import api from './api'

export const modelService = {
  // Get all available models from all providers
  getAllModels: () => {
    return api.get('/models')
  },

  // Get models from a specific provider
  getProviderModels: (provider) => {
    return api.get(`/models/${provider}`)
  }
}