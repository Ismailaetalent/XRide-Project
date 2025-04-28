<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>{{ $t('passenger.profile') }}</h1>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-header">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div v-if="profilePicture" class="profile-avatar">
                  <img :src="profilePicture" alt="Profile Picture" />
                </div>
                <div v-else class="profile-avatar initials">
                  {{ userInitials }}
                </div>
                <div class="avatar-overlay">
                  <label for="avatar-upload" class="upload-btn">
                    <i class="fas fa-camera" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="file-input"
                  />
                </div>
              </div>
              <p class="avatar-hint">{{ $t('passenger.uploadPhoto') }}</p>
            </div>
            <div class="user-info">
              <h2>{{ formData.name || authStore.userName }}</h2>
              <p v-if="authStore.user?.createdAt">
                {{ $t('passenger.memberSince') }}: {{ formatDate(authStore.user.createdAt) }}
              </p>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">{{ $t('passenger.personalInfo') }}</h3>

            <div class="form-group">
              <label for="name">{{ $t('common.name') }}</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                :placeholder="$t('common.name')"
              />
              <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            </div>

            <div class="form-group">
              <label for="email">{{ $t('common.email') }}</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                :placeholder="$t('common.email')"
              />
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label for="phone">{{ $t('common.phone') }}</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                :placeholder="$t('common.phone')"
              />
              <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">{{ $t('passenger.preferences') }}</h3>

            <div class="preference-group">
              <label>{{ $t('passenger.language') }}</label>
              <div class="preference-options">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  class="preference-btn"
                  :class="{ 'active': formData.language === lang.code }"
                  @click="formData.language = lang.code"
                >
                  {{ lang.name }}
                </button>
              </div>
            </div>

            <div class="preference-group">
              <label>{{ $t('passenger.currency') }}</label>
              <div class="preference-options">
                <button
                  v-for="curr in currencies"
                  :key="curr.code"
                  type="button"
                  class="preference-btn"
                  :class="{ 'active': formData.currency === curr.code }"
                  @click="formData.currency = curr.code"
                >
                  {{ curr.symbol }} {{ curr.code }}
                </button>
              </div>
            </div>

            <div class="preference-group">
              <label>{{ $t('passenger.distanceUnit') }}</label>
              <div class="preference-options">
                <button
                  type="button"
                  class="preference-btn"
                  :class="{ 'active': formData.unit === 'km' }"
                  @click="formData.unit = 'km'"
                >
                  {{ $t('passenger.kilometers') }}
                </button>
                <button
                  type="button"
                  class="preference-btn"
                  :class="{ 'active': formData.unit === 'mi' }"
                  @click="formData.unit = 'mi'"
                >
                  {{ $t('passenger.miles') }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-section notifications-section">
            <h3 class="section-title">{{ $t('passenger.notifications') }}</h3>

            <div class="toggle-group">
              <div class="toggle-label">
                <span>{{ $t('passenger.emailNotifications') }}</span>
                <p class="toggle-description">{{ $t('passenger.emailNotificationsDesc') }}</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.emailNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="toggle-group">
              <div class="toggle-label">
                <span>{{ $t('passenger.smsNotifications') }}</span>
                <p class="toggle-description">{{ $t('passenger.smsNotificationsDesc') }}</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.smsNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="toggle-group">
              <div class="toggle-label">
                <span>{{ $t('passenger.promotionalEmails') }}</span>
                <p class="toggle-description">{{ $t('passenger.promotionalEmailsDesc') }}</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.promotionalEmails" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="resetForm">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="save-btn" :disabled="isSaving">
              <span v-if="isSaving">{{ $t('common.loading') }}</span>
              <span v-else>{{ $t('common.save') }}</span>
            </button>
          </div>
        </form>
      </div>

      <div class="security-card">
        <h3 class="card-title">{{ $t('passenger.security') }}</h3>

        <button class="security-btn" @click="changePassword">
          <i class="fas fa-lock" />
          {{ $t('passenger.changePassword') }}
        </button>

        <button class="security-btn" @click="manage2FA">
          <i class="fas fa-shield-alt" />
          {{ $t('passenger.twoFactorAuth') }}
        </button>

        <div class="delete-account">
          <h3>{{ $t('passenger.dangerZone') }}</h3>
          <button class="delete-account-btn" @click="deleteAccount">
            {{ $t('passenger.deleteAccount') }}
          </button>
          <p class="warning-text">{{ $t('passenger.deleteAccountWarning') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore'

const { t, locale } = useI18n()
const authStore = useAuthStore()

// Profile picture
const profilePicture = ref<string | null>(null)

// User initials computed from name
const userInitials = computed(() => {
  return authStore.userInitials
})

// Form data
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  language: locale.value,
  currency: localStorage.getItem('currency') || 'USD',
  unit: localStorage.getItem('unit') || 'km',
  emailNotifications: true,
  smsNotifications: true,
  promotionalEmails: false
})

// Form errors
const errors = reactive({
  name: '',
  email: '',
  phone: ''
})

// Saving state
const isSaving = ref(false)

// Available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' }
]

// Available currencies
const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'RUB', symbol: '₽' }
]

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

// Handle profile image upload
function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Check file type
    if (!file.type.match('image.*')) {
      alert(t('errors.invalidFileType'))
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('errors.fileTooLarge'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        profilePicture.value = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// Validate form
function validateForm() {
  let isValid = true

  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.phone = ''

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

  return isValid
}

// Save profile
async function saveProfile() {
  if (!validateForm()) {
    return
  }

  isSaving.value = true

  try {
    // In a real app, this would call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user profile in auth store
    const success = await authStore.updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: profilePicture.value
    })

    if (success) {
      // Save preferences to localStorage
      localStorage.setItem('language', formData.language)
      localStorage.setItem('currency', formData.currency)
      localStorage.setItem('unit', formData.unit)

      // Update i18n locale
      locale.value = formData.language

      alert(t('passenger.profileUpdated'))
    } else {
      alert(t('errors.somethingWentWrong'))
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    alert(t('errors.somethingWentWrong'))
  } finally {
    isSaving.value = false
  }
}

// Reset form to initial values
function resetForm() {
  formData.name = authStore.userName
  formData.email = authStore.userEmail
  formData.phone = authStore.user?.phone || ''
  formData.language = locale.value
  formData.currency = localStorage.getItem('currency') || 'USD'
  formData.unit = localStorage.getItem('unit') || 'km'
  profilePicture.value = authStore.user?.avatar || null

  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.phone = ''
}

// Security actions
function changePassword() {
  // In a real app, this would open a modal or navigate to a password change page
  alert(t('passenger.changePasswordPrompt'))
}

function manage2FA() {
  // In a real app, this would open a modal or navigate to a 2FA management page
  alert(t('passenger.manage2FAPrompt'))
}

function deleteAccount() {
  // In a real app, this would show a confirmation dialog and then call an API
  if (window.confirm(t('passenger.deleteAccountConfirm'))) {
    alert(t('passenger.accountDeletionRequested'))
  }
}

// Initialize form data from auth store
onMounted(() => {
  resetForm()
})
</script>

<style scoped>
.profile-page {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
}

.profile-card,
.security-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-section {
  margin-right: 1.5rem;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar.initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f86906;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #f86906;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid white;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.avatar-hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.user-info h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 0.25rem;
}

.user-info p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  border-color: #f86906;
  outline: none;
}

.error-message {
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.preference-group {
  margin-bottom: 1rem;
}

.preference-group label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
}

.preference-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preference-btn {
  padding: 0.5rem 0.75rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.preference-btn.active {
  background-color: #f86906;
  color: white;
  border-color: #f86906;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.toggle-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.toggle-label {
  flex: 1;
}

.toggle-label span {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.toggle-description {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #f86906;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666;
}

.save-btn {
  background-color: #f86906;
  border: none;
  color: white;
}

.save-btn:disabled {
  background-color: #ffccaa;
  cursor: not-allowed;
}

.security-card .card-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.security-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 1rem;
  cursor: pointer;
  text-align: left;
}

.security-btn i {
  margin-right: 0.5rem;
  width: 20px;
  text-align: center;
}

.delete-account {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f5f5f5;
}

.delete-account h3 {
  font-size: 1rem;
  color: #e53935;
  margin-bottom: 1rem;
}

.delete-account-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  color: #e53935;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.warning-text {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

@media (max-width: 992px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .security-card {
    order: -1;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {
  .form-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar-section {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .avatar-wrapper {
    margin: 0 auto 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
