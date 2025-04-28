<template>
  <div class="profile-page">
    <h1>{{ $t('driver.profile') }}</h1>
    <p class="page-subtitle">{{ $t('driver.profileDesc') }}</p>

    <div class="profile-content">
      <div class="profile-info-card">
        <div class="card-header">
          <h2>{{ $t('driver.personalInfo') }}</h2>
          <button
            v-if="!editPersonalInfo"
            class="edit-btn"
            @click="startEditPersonalInfo"
          >
            <i class="fas fa-pencil-alt"></i>
            {{ $t('common.edit') }}
          </button>
          <div class="header-actions" v-else>
            <button class="cancel-btn" @click="cancelEditPersonalInfo">
              {{ $t('common.cancel') }}
            </button>
            <button class="save-btn" @click="savePersonalInfo">
              {{ $t('common.save') }}
            </button>
          </div>
        </div>

        <div class="profile-details" :class="{ 'editable': editPersonalInfo }">
          <div class="avatar-section">
            <div class="avatar">
              <img v-if="profileData.avatar" :src="profileData.avatar" alt="Profile Photo">
              <div v-else class="avatar-placeholder">
                {{ getInitials(profileData.firstName, profileData.lastName) }}
              </div>
            </div>
            <div v-if="editPersonalInfo" class="avatar-actions">
              <button class="upload-btn" @click="triggerAvatarUpload">
                <i class="fas fa-camera"></i>
                {{ $t('driver.changePhoto') }}
              </button>
              <input
                type="file"
                ref="avatarInput"
                style="display: none"
                accept="image/*"
                @change="handleAvatarUpload"
              >
              <button v-if="profileData.avatar" class="remove-btn" @click="removeAvatar">
                <i class="fas fa-trash-alt"></i>
                {{ $t('driver.removePhoto') }}
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">{{ $t('driver.firstName') }}</label>
              <input
                id="firstName"
                type="text"
                v-model="profileData.firstName"
                :disabled="!editPersonalInfo"
              >
            </div>
            <div class="form-group">
              <label for="lastName">{{ $t('driver.lastName') }}</label>
              <input
                id="lastName"
                type="text"
                v-model="profileData.lastName"
                :disabled="!editPersonalInfo"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">{{ $t('common.email') }}</label>
              <input
                id="email"
                type="email"
                v-model="profileData.email"
                :disabled="!editPersonalInfo"
              >
            </div>
            <div class="form-group">
              <label for="phone">{{ $t('common.phone') }}</label>
              <input
                id="phone"
                type="tel"
                v-model="profileData.phone"
                :disabled="!editPersonalInfo"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="birthDate">{{ $t('driver.birthDate') }}</label>
              <input
                id="birthDate"
                type="date"
                v-model="profileData.birthDate"
                :disabled="!editPersonalInfo"
              >
            </div>
            <div class="form-group">
              <label for="gender">{{ $t('driver.gender') }}</label>
              <select
                id="gender"
                v-model="profileData.gender"
                :disabled="!editPersonalInfo"
              >
                <option value="male">{{ $t('driver.male') }}</option>
                <option value="female">{{ $t('driver.female') }}</option>
                <option value="other">{{ $t('driver.other') }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="address">{{ $t('driver.address') }}</label>
            <input
              id="address"
              type="text"
              v-model="profileData.address"
              :disabled="!editPersonalInfo"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">{{ $t('driver.city') }}</label>
              <input
                id="city"
                type="text"
                v-model="profileData.city"
                :disabled="!editPersonalInfo"
              >
            </div>
            <div class="form-group">
              <label for="zipCode">{{ $t('driver.zipCode') }}</label>
              <input
                id="zipCode"
                type="text"
                v-model="profileData.zipCode"
                :disabled="!editPersonalInfo"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="driver-license-card">
        <div class="card-header">
          <h2>{{ $t('driver.driverLicense') }}</h2>
          <button
            v-if="!editLicense"
            class="edit-btn"
            @click="startEditLicense"
          >
            <i class="fas fa-pencil-alt"></i>
            {{ $t('common.edit') }}
          </button>
          <div class="header-actions" v-else>
            <button class="cancel-btn" @click="cancelEditLicense">
              {{ $t('common.cancel') }}
            </button>
            <button class="save-btn" @click="saveLicense">
              {{ $t('common.save') }}
            </button>
          </div>
        </div>

        <div class="license-details" :class="{ 'editable': editLicense }">
          <div class="form-row">
            <div class="form-group">
              <label for="licenseNumber">{{ $t('driver.licenseNumber') }}</label>
              <input
                id="licenseNumber"
                type="text"
                v-model="licenseData.number"
                :disabled="!editLicense"
              >
            </div>
            <div class="form-group">
              <label for="licenseClass">{{ $t('driver.licenseClass') }}</label>
              <select
                id="licenseClass"
                v-model="licenseData.class"
                :disabled="!editLicense"
              >
                <option v-for="cls in licenseClasses" :key="cls.value" :value="cls.value">
                  {{ cls.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="licenseIssueDate">{{ $t('driver.issueDate') }}</label>
              <input
                id="licenseIssueDate"
                type="date"
                v-model="licenseData.issueDate"
                :disabled="!editLicense"
              >
            </div>
            <div class="form-group">
              <label for="licenseExpiryDate">{{ $t('driver.expiryDate') }}</label>
              <input
                id="licenseExpiryDate"
                type="date"
                v-model="licenseData.expiryDate"
                :disabled="!editLicense"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="licenseCountry">{{ $t('driver.issuingCountry') }}</label>
            <select
              id="licenseCountry"
              v-model="licenseData.country"
              :disabled="!editLicense"
            >
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ $t('driver.licensePhotos') }}</label>
            <div class="license-photos">
              <div class="license-photo-container">
                <div class="license-photo">
                  <div v-if="!licenseData.frontPhoto" class="photo-placeholder">
                    <i class="fas fa-id-card"></i>
                    <p>{{ $t('driver.frontSide') }}</p>
                  </div>
                  <img v-else :src="licenseData.frontPhoto" alt="License Front">
                </div>
                <button
                  v-if="editLicense"
                  class="upload-photo-btn"
                  @click="triggerLicensePhotoUpload('front')"
                >
                  {{ licenseData.frontPhoto ? $t('driver.replace') : $t('driver.upload') }}
                </button>
              </div>

              <div class="license-photo-container">
                <div class="license-photo">
                  <div v-if="!licenseData.backPhoto" class="photo-placeholder">
                    <i class="fas fa-id-card"></i>
                    <p>{{ $t('driver.backSide') }}</p>
                  </div>
                  <img v-else :src="licenseData.backPhoto" alt="License Back">
                </div>
                <button
                  v-if="editLicense"
                  class="upload-photo-btn"
                  @click="triggerLicensePhotoUpload('back')"
                >
                  {{ licenseData.backPhoto ? $t('driver.replace') : $t('driver.upload') }}
                </button>
              </div>
            </div>
            <input
              type="file"
              ref="licensePhotoInput"
              style="display: none"
              accept="image/*"
              @change="handleLicensePhotoUpload"
            >
          </div>
        </div>
      </div>

      <div class="account-settings-card">
        <h2>{{ $t('driver.accountSettings') }}</h2>

        <div class="settings-section">
          <h3>{{ $t('driver.languagePreference') }}</h3>
          <div class="language-selector">
            <button
              v-for="lang in languages"
              :key="lang.code"
              class="language-btn"
              :class="{ 'active': profileData.language === lang.code }"
              @click="setLanguage(lang.code)"
            >
              {{ lang.name }}
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h3>{{ $t('driver.changePassword') }}</h3>
          <div class="password-form">
            <div class="form-group">
              <label for="currentPassword">{{ $t('driver.currentPassword') }}</label>
              <input
                id="currentPassword"
                type="password"
                v-model="passwordData.current"
              >
            </div>
            <div class="form-group">
              <label for="newPassword">{{ $t('driver.newPassword') }}</label>
              <input
                id="newPassword"
                type="password"
                v-model="passwordData.new"
              >
            </div>
            <div class="form-group">
              <label for="confirmPassword">{{ $t('driver.confirmPassword') }}</label>
              <input
                id="confirmPassword"
                type="password"
                v-model="passwordData.confirm"
              >
            </div>
            <div class="form-actions">
              <button
                class="change-password-btn"
                :disabled="!passwordData.current || !passwordData.new || !passwordData.confirm"
                @click="changePassword"
              >
                {{ $t('driver.updatePassword') }}
              </button>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>{{ $t('driver.notificationSettings') }}</h3>
          <div class="notification-options">
            <div class="notification-option">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="notificationSettings.email"
                >
                <span class="option-label">{{ $t('driver.emailNotifications') }}</span>
              </label>
              <p class="option-description">{{ $t('driver.emailNotificationsDesc') }}</p>
            </div>
            <div class="notification-option">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="notificationSettings.sms"
                >
                <span class="option-label">{{ $t('driver.smsNotifications') }}</span>
              </label>
              <p class="option-description">{{ $t('driver.smsNotificationsDesc') }}</p>
            </div>
            <div class="notification-option">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="notificationSettings.push"
                >
                <span class="option-label">{{ $t('driver.pushNotifications') }}</span>
              </label>
              <p class="option-description">{{ $t('driver.pushNotificationsDesc') }}</p>
            </div>
          </div>
          <div class="form-actions">
            <button
              class="save-settings-btn"
              @click="saveNotificationSettings"
            >
              {{ $t('driver.saveSettings') }}
            </button>
          </div>
        </div>

        <div class="settings-section danger-zone">
          <h3>{{ $t('driver.dangerZone') }}</h3>
          <p class="danger-description">{{ $t('driver.dangerZoneDesc') }}</p>
          <button class="deactivate-btn" @click="showDeactivateModal = true">
            {{ $t('driver.deactivateAccount') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Deactivate Account Modal -->
    <div v-if="showDeactivateModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('driver.confirmDeactivation') }}</h3>
          <button class="modal-close" @click="showDeactivateModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ $t('driver.deactivateWarning') }}</p>
          <div class="form-group">
            <label for="deactivate-reason">{{ $t('driver.deactivateReason') }}</label>
            <select id="deactivate-reason" v-model="deactivateReason">
              <option value="">{{ $t('driver.selectReason') }}</option>
              <option value="taking_break">{{ $t('driver.takingBreak') }}</option>
              <option value="too_few_rides">{{ $t('driver.tooFewRides') }}</option>
              <option value="using_another_app">{{ $t('driver.usingAnotherApp') }}</option>
              <option value="other">{{ $t('driver.otherReason') }}</option>
            </select>
          </div>
          <div v-if="deactivateReason === 'other'" class="form-group">
            <label for="deactivate-notes">{{ $t('driver.additionalFeedback') }}</label>
            <textarea id="deactivate-notes" v-model="deactivateNotes" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="deactivateConfirm">
              <span class="confirm-text">{{ $t('driver.deactivateConfirm') }}</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showDeactivateModal = false">
            {{ $t('common.cancel') }}
          </button>
          <button
            class="danger-btn"
            :disabled="!deactivateConfirm || !deactivateReason"
            @click="deactivateAccount"
          >
            {{ $t('driver.deactivate') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Personal info state
const editPersonalInfo = ref(false)
const profileData = reactive({
  firstName: 'Jane',
  lastName: 'Driver',
  email: 'driver@example.com',
  phone: '+1 555-987-6543',
  birthDate: '1985-06-15',
  gender: 'female',
  address: '123 Main St',
  city: 'New York',
  zipCode: '10001',
  language: 'en',
  avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
})

let originalProfileData = { ...profileData }

// License data
const editLicense = ref(false)
const licenseData = reactive({
  number: 'DL6789012345',
  class: 'B',
  issueDate: '2020-03-10',
  expiryDate: '2026-03-10',
  country: 'US',
  frontPhoto: 'https://cdn.pixabay.com/photo/2016/02/22/11/05/id-1215525_1280.jpg',
  backPhoto: null
})

let originalLicenseData = { ...licenseData }

// License options
const licenseClasses = [
  { value: 'A', label: t('driver.licenseClassA') },
  { value: 'B', label: t('driver.licenseClassB') },
  { value: 'C', label: t('driver.licenseClassC') },
  { value: 'D', label: t('driver.licenseClassD') }
]

// Country list (abbreviated for simplicity)
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'RU', name: 'Russia' }
]

// Languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' }
]

// Password change data
const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Notification settings
const notificationSettings = reactive({
  email: true,
  sms: true,
  push: false
})

// Deactivation state
const showDeactivateModal = ref(false)
const deactivateReason = ref('')
const deactivateNotes = ref('')
const deactivateConfirm = ref(false)

// Reference to file inputs
const avatarInput = ref(null)
const licensePhotoInput = ref(null)
const currentLicenseSide = ref('front')

// Methods
function getInitials(firstName, lastName) {
  if (!firstName && !lastName) return ''

  const first = firstName ? firstName.charAt(0) : ''
  const last = lastName ? lastName.charAt(0) : ''

  return (first + last).toUpperCase()
}

// Personal info methods
function startEditPersonalInfo() {
  editPersonalInfo.value = true
  originalProfileData = { ...profileData }
}

function cancelEditPersonalInfo() {
  Object.assign(profileData, originalProfileData)
  editPersonalInfo.value = false
}

function savePersonalInfo() {
  // In a real app, this would send the data to an API
  editPersonalInfo.value = false
  console.log('Profile data saved:', profileData)
  alert(t('driver.profileSaved'))
}

function triggerAvatarUpload() {
  avatarInput.value.click()
}

function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // In a real app, this would upload the file to a server
  const reader = new FileReader()
  reader.onload = (e) => {
    profileData.avatar = e.target.result
  }
  reader.readAsDataURL(file)

  // Reset input
  event.target.value = ''
}

function removeAvatar() {
  profileData.avatar = null
}

// License methods
function startEditLicense() {
  editLicense.value = true
  originalLicenseData = { ...licenseData }
}

function cancelEditLicense() {
  Object.assign(licenseData, originalLicenseData)
  editLicense.value = false
}

function saveLicense() {
  // In a real app, this would send the data to an API
  editLicense.value = false
  console.log('License data saved:', licenseData)
  alert(t('driver.licenseSaved'))
}

function triggerLicensePhotoUpload(side) {
  currentLicenseSide.value = side
  licensePhotoInput.value.click()
}

function handleLicensePhotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // In a real app, this would upload the file to a server
  const reader = new FileReader()
  reader.onload = (e) => {
    if (currentLicenseSide.value === 'front') {
      licenseData.frontPhoto = e.target.result
    } else {
      licenseData.backPhoto = e.target.result
    }
  }
  reader.readAsDataURL(file)

  // Reset input
  event.target.value = ''
}

// Settings methods
function setLanguage(code) {
  profileData.language = code
  // In a real app, this would update the app's language
}

function changePassword() {
  // Validation
  if (passwordData.new !== passwordData.confirm) {
    alert(t('errors.passwordsDoNotMatch'))
    return
  }

  // In a real app, this would send a request to change the password
  console.log('Password change:', passwordData)
  alert(t('driver.passwordChanged'))

  // Reset form
  passwordData.current = ''
  passwordData.new = ''
  passwordData.confirm = ''
}

function saveNotificationSettings() {
  // In a real app, this would update notification settings
  console.log('Notification settings saved:', notificationSettings)
  alert(t('driver.settingsSaved'))
}

function deactivateAccount() {
  // In a real app, this would deactivate the account
  console.log('Account deactivation:', { reason: deactivateReason, notes: deactivateNotes })
  showDeactivateModal.value = false
  alert(t('driver.accountDeactivated'))
}

// Lifecycle hooks
onMounted(() => {
  // In a real app, this would fetch the user's profile data
})
</script>

<style scoped>
.profile-page {
  padding: 1.5rem;
}

h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #666;
  margin-bottom: 1.5rem;
}

.profile-content {
  display: grid;
  gap: 1.5rem;
}

.profile-info-card,
.driver-license-card,
.account-settings-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-btn,
.save-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: none;
  border: none;
  color: #0366d6;
}

.save-btn {
  background-color: #25b847;
  border: none;
  color: white;
}

.save-btn:hover {
  background-color: #1e9e3e;
}

.cancel-btn {
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #666;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.profile-details.editable,
.license-details.editable {
  border: 1px solid #c8e1ff;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9fcff;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1.5rem;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f2ff;
  color: #0366d6;
  font-size: 1.5rem;
  font-weight: 500;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-btn,
.remove-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn {
  background-color: #0366d6;
  color: white;
  border: none;
}

.upload-btn:hover {
  background-color: #0255b3;
}

.remove-btn {
  background-color: white;
  color: #e53935;
  border: 1px solid #e53935;
}

.remove-btn:hover {
  background-color: #ffebee;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: white;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.license-photos {
  display: flex;
  gap: 1rem;
}

.license-photo-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.license-photo {
  width: 100%;
  height: 150px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.license-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
}

.photo-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.photo-placeholder p {
  font-size: 0.9rem;
}

.upload-photo-btn {
  padding: 0.5rem;
  text-align: center;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.upload-photo-btn:hover {
  background-color: #0255b3;
}

.account-settings-card h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.settings-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.language-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.language-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-btn.active {
  background-color: #0366d6;
  color: white;
  border-color: #0366d6;
}

.password-form {
  max-width: 500px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.change-password-btn,
.save-settings-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.change-password-btn:hover,
.save-settings-btn:hover {
  background-color: #0255b3;
}

.change-password-btn:disabled {
  background-color: #a5c8ef;
  cursor: not-allowed;
}

.notification-options {
  display: grid;
  gap: 1rem;
}

.notification-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input {
  margin-right: 0.5rem;
  width: auto;
}

.option-label {
  font-weight: 500;
}

.option-description {
  font-size: 0.9rem;
  color: #666;
  margin-left: 1.5rem;
}

.danger-zone {
  border-top: 1px solid #ffebee;
  margin-top: 2rem;
  padding-top: 2rem;
}

.danger-description {
  color: #666;
  margin-bottom: 1rem;
}

.deactivate-btn {
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #e53935;
  border: 1px solid #e53935;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.deactivate-btn:hover {
  background-color: #ffebee;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1.25rem;
  color: #666;
}

.confirm-text {
  color: #e53935;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.secondary-btn,
.danger-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.secondary-btn:hover {
  background-color: #f5f5f5;
}

.danger-btn {
  background-color: #e53935;
  color: white;
  border: none;
}

.danger-btn:hover {
  background-color: #d32f2f;
}

.danger-btn:disabled {
  background-color: #ef9a9a;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .license-photos {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
