import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(credentials)
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          toast.success(`Welcome back, ${user.username}!`)
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Login failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(userData)
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          toast.success(`Welcome, ${user.username}!`)
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Registration failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
        toast.success('Logged out successfully')
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const response = await authService.getMe()
          const { user } = response.data
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          // Token is invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      updatePreferences: async (preferences) => {
        try {
          const response = await authService.updatePreferences(preferences)
          const { user } = response.data
          
          set({ user })
          toast.success('Preferences updated successfully')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to update preferences'
          toast.error(message)
          return { success: false, error: message }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore