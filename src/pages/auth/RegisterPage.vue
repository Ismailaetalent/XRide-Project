<template>
  <div class="register-page">
    <h1 class="auth-title">{{ $t('auth.registerTitle') }}</h1>

    <div v-if="authStore.error" class="error-alert">
      {{ authStore.error }}
    </div>

    <div class="auth-form">
      <div class="input-group">
        <label for="name">{{ $t('common.name') }}</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          :placeholder="$t('common.name')"
        >
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

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
        <label for="phone">{{ $t('common.phone') }}</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          :placeholder="$t('common.phone')"
        >
        <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
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

      <div class="input-group">
        <label for="confirmPassword">{{ $t('auth.confirmPassword') }}</label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          :placeholder="$t('auth.confirmPassword')"
        >
        <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
      </div>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="formData.isDriver"
          >
          {{ $t('driver.becomeDriver') }}
        </label>
      </div>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="formData.agreeTerms"
          >
          {{ $t('auth.termsAgree') }}
          <router-link to="/privacy">{{ $t('auth.privacyPolicy') }}</router-link>
          {{ $t('common.and') }}
          <router-link to="/terms">{{ $t('auth.serviceAgreement') }}</router-link>
        </label>
        <div v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</div>
      </div>

      <button class="submit-btn" @click="register" :disabled="authStore.loading">
        <span v-if="authStore.loading">{{ $t('common.loading') }}</span>
        <span v-else>{{ $t('common.signup') }}</span>
      </button>
    </div>

    <div class="auth-footer">
      <p>
        {{ $t('auth.alreadyHaveAccount') }}
        <router-link to="/auth/login">{{ $t('common.login') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Form data
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  isDriver: false,
  agreeTerms: false
})

// Form errors
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

// Form validation
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Validate name
  if (!formData.name) {
    errors.name = t('errors.required')
    isValid = false
  } else if (formData.name.length < 2) {
    errors.name = t('errors.fieldTooShort')
    isValid = false
  }

  // Validate email
  if (!formData.email) {
    errors.email = t('errors.required')
    isValid = false
  } else {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = t('errors.invalidEmail')
      isValid = false
    }
  }

  // Validate phone (optional)
  if (formData.phone && formData.phone.length < 6) {
    errors.phone = t('errors.invalidPhone')
    isValid = false
  }

  // Validate password
  if (!formData.password) {
    errors.password = t('errors.required')
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = t('errors.passwordLength')
    isValid = false
  }

  // Validate confirm password
  if (!formData.confirmPassword) {
    errors.confirmPassword = t('errors.required')
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = t('errors.passwordsDoNotMatch')
    isValid = false
  }

  // Validate terms agreement
  if (!formData.agreeTerms) {
    errors.agreeTerms = t('errors.termsRequired')
    isValid = false
  }

  return isValid
}

// Register function
const register = async () => {
  if (!validateForm()) {
    return
  }

  const success = await authStore.register(
    {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      isDriver: formData.isDriver
    },
    formData.password
  )

  if (success) {
    if (formData.isDriver) {
      router.push('/driver/dashboard')
    } else {
      router.push('/passenger/dashboard')
    }
  }
}
</script>

<style scoped>
.register-page {
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

.auth-form {
  margin-bottom: 1.5rem;
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

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"] {
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

.checkbox-group {
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.2rem;
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
