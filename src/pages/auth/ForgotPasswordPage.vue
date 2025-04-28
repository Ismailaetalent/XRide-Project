<template>
  <div class="forgot-password-page">
    <h1 class="auth-title">{{ $t('auth.forgotPasswordTitle') }}</h1>

    <div v-if="authStore.error" class="error-alert">
      {{ authStore.error }}
    </div>

    <div v-if="resetRequested" class="success-message">
      <i class="fas fa-check-circle"></i>
      <p>{{ $t('auth.resetLinkSent') }}</p>
      <p class="help-text">{{ $t('auth.checkEmailInstructions') }}</p>
      <router-link to="/auth/login" class="back-to-login">
        {{ $t('auth.backToLogin') }}
      </router-link>
    </div>

    <form v-else @submit.prevent="requestReset" class="auth-form">
      <p class="form-description">
        {{ $t('auth.forgotPasswordDescription') }}
      </p>

      <div class="input-group">
        <label for="email">{{ $t('common.email') }}</label>
        <input
          id="email"
          v-model="email"
          type="email"
          :placeholder="$t('common.email')"
          required
        >
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('auth.resetPassword') }}</span>
        </button>
      </div>
    </form>

    <div class="auth-footer">
      <p>
        {{ $t('auth.rememberPassword') }}
        <router-link to="/auth/login">{{ $t('common.login') }}</router-link>
      </p>
      <p>
        {{ $t('auth.dontHaveAccount') }}
        <router-link to="/auth/register">{{ $t('common.signup') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore'

const { t } = useI18n()
const authStore = useAuthStore()

// Form data
const email = ref('')
const errors = ref({
  email: ''
})
const isSubmitting = ref(false)
const resetRequested = ref(false)

// Validate email
function validateEmail() {
  errors.value.email = ''

  if (!email.value) {
    errors.value.email = t('errors.required')
    return false
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = t('errors.invalidEmail')
    return false
  }

  return true
}

// Request password reset
async function requestReset() {
  if (!validateEmail()) {
    return
  }

  isSubmitting.value = true

  try {
    // In a real app, this would call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Set success state
    resetRequested.value = true

    // Clear any previous errors
    authStore.error = null
  } catch (error) {
    console.error('Error requesting password reset:', error)
    authStore.error = t('errors.somethingWentWrong')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
  width: 100%;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.form-description {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.error-alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}

.success-message {
  text-align: center;
  margin-bottom: 1.5rem;
}

.success-message i {
  font-size: 3rem;
  color: #25b847;
  margin-bottom: 1rem;
}

.success-message p {
  color: #333;
  margin-bottom: 0.5rem;
}

.success-message .help-text {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.back-to-login {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #f86906;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.back-to-login:hover {
  background-color: #e55c00;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  border-color: #f86906;
  outline: none;
}

.error-message {
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: #e55c00;
}

.submit-btn:disabled {
  background-color: #ffa366;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
}

.auth-footer p {
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #f86906;
  text-decoration: none;
}
</style>
