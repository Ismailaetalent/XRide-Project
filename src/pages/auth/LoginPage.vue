<template>
  <div class="login-page">
    <h1 class="auth-title">{{ $t('auth.loginTitle') }}</h1>

    <div v-if="authStore.error" class="error-alert">
      {{ authStore.error }}
    </div>

    <div class="auth-options">
      <button class="auth-option-btn email" @click="authMethod = 'email'">
        <i class="fas fa-envelope" />
        {{ $t('common.continueWith') }} {{ $t('common.email') }}
      </button>

      <button class="auth-option-btn phone" @click="authMethod = 'phone'">
        <i class="fas fa-phone" />
        {{ $t('common.continueWith') }} {{ $t('common.phone') }}
      </button>

      <button class="auth-option-btn apple">
        <i class="fab fa-apple" />
        {{ $t('common.continueWith') }} Apple
      </button>

      <button class="auth-option-btn google">
        <i class="fab fa-google" />
        {{ $t('common.continueWith') }} Google
      </button>

      <button class="auth-option-btn facebook">
        <i class="fab fa-facebook-f" />
        {{ $t('common.continueWith') }} Facebook
      </button>
    </div>

    <div v-if="authMethod === 'email'" class="auth-form">
      <div class="input-group">
        <label for="email">{{ $t('common.email') }}</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          :placeholder="$t('common.email')"
        >
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <div class="input-group">
        <label for="password">{{ $t('common.password') }}</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          :placeholder="$t('common.password')"
        >
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <div class="form-footer">
        <router-link to="/auth/forgot-password" class="forgot-password">
          {{ $t('auth.forgotPassword') }}
        </router-link>
      </div>

      <button class="submit-btn" @click="login" :disabled="authStore.loading">
        <span v-if="authStore.loading">{{ $t('common.loading') }}</span>
        <span v-else>{{ $t('common.login') }}</span>
      </button>
    </div>

    <div v-else-if="authMethod === 'phone'" class="auth-form">
      <div class="input-group">
        <label for="phone">{{ $t('common.phone') }}</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          :placeholder="$t('common.phone')"
        >
        <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
      </div>

      <p class="info-text">
        {{ $t('auth.smsInfo') }}
      </p>

      <button class="submit-btn" @click="requestCode" :disabled="authStore.loading">
        <span v-if="authStore.loading">{{ $t('common.loading') }}</span>
        <span v-else>{{ $t('auth.requestCode') }}</span>
      </button>
    </div>

    <div class="auth-footer">
      <p>
        {{ $t('auth.dontHaveAccount') }}
        <router-link to="/auth/register">{{ $t('common.signup') }}</router-link>
      </p>

      <p class="terms-text">
        {{ $t('auth.termsAgree') }}
        <router-link to="/privacy">{{ $t('auth.privacyPolicy') }}</router-link>
        {{ $t('common.and') }}
        <router-link to="/terms">{{ $t('auth.serviceAgreement') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Auth method selection
const authMethod = ref('')

// Form data
const formData = reactive({
  email: '',
  password: '',
  phone: ''
})

// Form errors
const errors = reactive({
  email: '',
  password: '',
  phone: ''
})

// Validate email
const validateEmail = () => {
  errors.email = ''

  if (!formData.email) {
    errors.email = t('errors.required')
    return false
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = t('errors.invalidEmail')
    return false
  }

  return true
}

// Validate password
const validatePassword = () => {
  errors.password = ''

  if (!formData.password) {
    errors.password = t('errors.required')
    return false
  }

  if (formData.password.length < 6) {
    errors.password = t('errors.passwordLength')
    return false
  }

  return true
}

// Validate phone
const validatePhone = () => {
  errors.phone = ''

  if (!formData.phone) {
    errors.phone = t('errors.required')
    return false
  }

  // Simple phone validation (a more complex one would be used in production)
  if (formData.phone.length < 6) {
    errors.phone = t('errors.invalidPhone')
    return false
  }

  return true
}

// Login with email and password
const login = async () => {
  if (!validateEmail() || !validatePassword()) {
    return
  }

  const success = await authStore.login(formData.email, formData.password)

  if (success) {
    if (authStore.isDriver) {
      router.push('/driver/dashboard')
    } else {
      router.push('/passenger/dashboard')
    }
  }
}

// Request SMS code for phone login
const requestCode = async () => {
  if (!validatePhone()) {
    return
  }

  // In a real implementation, this would call an API endpoint
  // For now, we'll just show an alert
  alert(t('auth.codeWasSent'))
}
</script>

<style scoped>
.login-page {
  width: 100%;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.error-alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}

.auth-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.auth-option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid #ddd;
  background-color: white;
}

.auth-option-btn i {
  font-size: 1.25rem;
}

.auth-option-btn.email:hover {
  background-color: #f5f5f5;
}

.auth-option-btn.phone:hover {
  background-color: #f5f5f5;
}

.auth-option-btn.apple {
  background-color: #000;
  color: white;
  border-color: #000;
}

.auth-option-btn.apple:hover {
  background-color: #333;
}

.auth-option-btn.google {
  background-color: white;
  color: #4285F4;
  border-color: #ddd;
}

.auth-option-btn.google:hover {
  background-color: #f5f5f5;
}

.auth-option-btn.facebook {
  background-color: #3b5998;
  color: white;
  border-color: #3b5998;
}

.auth-option-btn.facebook:hover {
  background-color: #2d4373;
}

.auth-form {
  margin-top: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
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

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.forgot-password {
  color: #f86906;
  text-decoration: none;
  font-size: 0.9rem;
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

.info-text {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
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

.terms-text {
  font-size: 0.8rem;
  color: #999;
  margin-top: 1.5rem;
}
</style>
