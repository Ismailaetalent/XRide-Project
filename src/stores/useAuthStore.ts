import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize user from localStorage if available
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  } catch (err) {
    console.error('Error parsing user from localStorage:', err)
  }

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isDriver = computed(() => user.value?.isDriver || false)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userInitials = computed(() => {
    if (!user.value?.name) return ''

    const names = user.value.name.split(' ')
    if (names.length === 1) return names[0].charAt(0)

    return names[0].charAt(0) + names[names.length - 1].charAt(0)
  })

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login({ email, password })

      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: Partial<User>, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register({
        name: userData.name || '',
        email: userData.email || '',
        password,
        phone: userData.phone,
        isDriver: userData.isDriver
      })

      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    token.value = null
    user.value = null
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user.value) return false

    loading.value = true
    error.value = null

    try {
      const updatedUser = await authService.updateProfile(userData)

      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (email: string) => {
    loading.value = true
    error.value = null

    try {
      await authService.forgotPassword(email)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    loading.value = true
    error.value = null

    try {
      await authService.resetPassword(token, newPassword)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    token,
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    isDriver,
    userName,
    userEmail,
    userInitials,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword
  }
})
