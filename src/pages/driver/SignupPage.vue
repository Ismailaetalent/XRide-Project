<template>
  <div class="driver-signup-page">
    <div class="container">
      <div class="signup-header">
        <h1>{{ $t('driver.becomeDriver') }}</h1>
        <p class="subtitle">{{ $t('driver.signupSubtitle') }}</p>
      </div>

      <div class="signup-content">
        <div class="signup-benefits">
          <div class="benefits-header">
            <h2>{{ $t('driver.whyJoin') }}</h2>
            <p>{{ $t('driver.benefitsDescription') }}</p>
          </div>

          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-wallet"></i>
              </div>
              <div class="benefit-content">
                <h3>{{ $t('driver.benefitEarnings') }}</h3>
                <p>{{ $t('driver.benefitEarningsDesc') }}</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="benefit-content">
                <h3>{{ $t('driver.benefitFlexibility') }}</h3>
                <p>{{ $t('driver.benefitFlexibilityDesc') }}</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-hands-helping"></i>
              </div>
              <div class="benefit-content">
                <h3>{{ $t('driver.benefitSupport') }}</h3>
                <p>{{ $t('driver.benefitSupportDesc') }}</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="benefit-content">
                <h3>{{ $t('driver.benefitCommunity') }}</h3>
                <p>{{ $t('driver.benefitCommunityDesc') }}</p>
              </div>
            </div>
          </div>

          <div class="join-info">
            <div class="app-preview">
              <div class="driver-app-img-placeholder">
                <i class="fas fa-mobile-alt"></i>
                <span>Driver App Preview</span>
              </div>
            </div>
            <p class="join-info-text">{{ $t('driver.joinInfo') }}</p>
          </div>
        </div>

        <div class="signup-form-container">
          <div v-if="registrationCompleted" class="success-message">
            <i class="fas fa-check-circle"></i>
            <h2>{{ $t('driver.thanksForJoining') }}</h2>
            <p>{{ $t('driver.applicationReceived') }}</p>
            <p class="next-steps">{{ $t('driver.nextSteps') }}</p>
            <button class="go-home-btn" @click="goToHome">
              {{ $t('common.backToHome') }}
            </button>
          </div>

          <form v-else @submit.prevent="submitApplication" class="signup-form">
            <h2>{{ $t('driver.applicationForm') }}</h2>

            <div class="form-section">
              <h3>{{ $t('driver.personalInfo') }}</h3>

              <div class="form-group">
                <label for="firstName">{{ $t('driver.firstName') }}</label>
                <input
                  id="firstName"
                  v-model="formData.firstName"
                  type="text"
                  required
                >
                <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
              </div>

              <div class="form-group">
                <label for="lastName">{{ $t('driver.lastName') }}</label>
                <input
                  id="lastName"
                  v-model="formData.lastName"
                  type="text"
                  required
                >
                <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
              </div>

              <div class="form-group">
                <label for="email">{{ $t('common.email') }}</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                >
                <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label for="phone">{{ $t('common.phone') }}</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  required
                >
                <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
              </div>

              <div class="form-group">
                <label for="city">{{ $t('driver.city') }}</label>
                <input
                  id="city"
                  v-model="formData.city"
                  type="text"
                  required
                >
                <div v-if="errors.city" class="error-message">{{ errors.city }}</div>
              </div>
            </div>

            <div class="form-section">
              <h3>{{ $t('driver.vehicleInfo') }}</h3>

              <div class="form-group">
                <label for="vehicleType">{{ $t('driver.vehicleType') }}</label>
                <select
                  id="vehicleType"
                  v-model="formData.vehicleType"
                  required
                >
                  <option value="">{{ $t('driver.selectVehicleType') }}</option>
                  <option value="economy">{{ $t('booking.economy') }}</option>
                  <option value="comfort">{{ $t('booking.comfort') }}</option>
                  <option value="business">{{ $t('booking.business') }}</option>
                  <option value="premium">{{ $t('booking.premium') }}</option>
                  <option value="suv">{{ $t('booking.suv') }}</option>
                  <option value="van">{{ $t('booking.van') }}</option>
                  <option value="minibus">{{ $t('booking.minibus') }}</option>
                  <option value="bus">{{ $t('booking.bus') }}</option>
                </select>
                <div v-if="errors.vehicleType" class="error-message">{{ errors.vehicleType }}</div>
              </div>

              <div class="form-group">
                <label for="vehicleMake">{{ $t('driver.vehicleMake') }}</label>
                <input
                  id="vehicleMake"
                  v-model="formData.vehicleMake"
                  type="text"
                  required
                >
                <div v-if="errors.vehicleMake" class="error-message">{{ errors.vehicleMake }}</div>
              </div>

              <div class="form-group">
                <label for="vehicleModel">{{ $t('driver.vehicleModel') }}</label>
                <input
                  id="vehicleModel"
                  v-model="formData.vehicleModel"
                  type="text"
                  required
                >
                <div v-if="errors.vehicleModel" class="error-message">{{ errors.vehicleModel }}</div>
              </div>

              <div class="form-group">
                <label for="vehicleYear">{{ $t('driver.vehicleYear') }}</label>
                <input
                  id="vehicleYear"
                  v-model="formData.vehicleYear"
                  type="number"
                  min="1990"
                  :max="currentYear"
                  required
                >
                <div v-if="errors.vehicleYear" class="error-message">{{ errors.vehicleYear }}</div>
              </div>

              <div class="form-group">
                <label for="licensePlate">{{ $t('driver.licensePlate') }}</label>
                <input
                  id="licensePlate"
                  v-model="formData.licensePlate"
                  type="text"
                  required
                >
                <div v-if="errors.licensePlate" class="error-message">{{ errors.licensePlate }}</div>
              </div>
            </div>

            <div class="form-section">
              <h3>{{ $t('driver.documents') }}</h3>
              <p class="docs-info">{{ $t('driver.documentsInfo') }}</p>

              <div class="form-group">
                <label for="driverLicense">{{ $t('driver.driverLicense') }}</label>
                <div class="file-input-wrapper">
                  <input
                    id="driverLicense"
                    type="file"
                    @change="handleFileUpload('driverLicense', $event)"
                    accept="image/*,.pdf"
                  >
                  <div v-if="formData.driverLicense" class="file-selected">
                    <i class="fas fa-check"></i>
                    {{ formData.driverLicense.name }}
                  </div>
                </div>
                <div v-if="errors.driverLicense" class="error-message">{{ errors.driverLicense }}</div>
              </div>

              <div class="form-group">
                <label for="vehicleRegistration">{{ $t('driver.vehicleRegistration') }}</label>
                <div class="file-input-wrapper">
                  <input
                    id="vehicleRegistration"
                    type="file"
                    @change="handleFileUpload('vehicleRegistration', $event)"
                    accept="image/*,.pdf"
                  >
                  <div v-if="formData.vehicleRegistration" class="file-selected">
                    <i class="fas fa-check"></i>
                    {{ formData.vehicleRegistration.name }}
                  </div>
                </div>
                <div v-if="errors.vehicleRegistration" class="error-message">{{ errors.vehicleRegistration }}</div>
              </div>

              <div class="form-group">
                <label for="insurance">{{ $t('driver.insurance') }}</label>
                <div class="file-input-wrapper">
                  <input
                    id="insurance"
                    type="file"
                    @change="handleFileUpload('insurance', $event)"
                    accept="image/*,.pdf"
                  >
                  <div v-if="formData.insurance" class="file-selected">
                    <i class="fas fa-check"></i>
                    {{ formData.insurance.name }}
                  </div>
                </div>
                <div v-if="errors.insurance" class="error-message">{{ errors.insurance }}</div>
              </div>
            </div>

            <div class="form-section">
              <div class="checkbox-group">
                <input
                  id="termsAgreement"
                  v-model="formData.termsAgreement"
                  type="checkbox"
                  required
                >
                <label for="termsAgreement" class="checkbox-label">
                  {{ $t('driver.termsAgreement') }}
                  <a href="/terms" target="_blank">{{ $t('auth.serviceAgreement') }}</a>
                </label>
                <div v-if="errors.termsAgreement" class="error-message">{{ errors.termsAgreement }}</div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting">{{ $t('common.loading') }}</span>
                <span v-else>{{ $t('driver.submitApplication') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

// Current year for vehicle year validation
const currentYear = new Date().getFullYear()

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  vehicleType: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: currentYear,
  licensePlate: '',
  driverLicense: null as File | null,
  vehicleRegistration: null as File | null,
  insurance: null as File | null,
  termsAgreement: false
})

// Form errors
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  vehicleType: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  licensePlate: '',
  driverLicense: '',
  vehicleRegistration: '',
  insurance: '',
  termsAgreement: ''
})

// Form state
const isSubmitting = ref(false)
const registrationCompleted = ref(false)

// Handle file uploads
function handleFileUpload(fieldName: keyof typeof formData, event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    formData[fieldName] = input.files[0]
    errors[fieldName as keyof typeof errors] = ''
  }
}

// Form validation
function validateForm() {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Basic validation
  if (!formData.firstName) {
    errors.firstName = t('errors.required')
    isValid = false
  }

  if (!formData.lastName) {
    errors.lastName = t('errors.required')
    isValid = false
  }

  if (!formData.email) {
    errors.email = t('errors.required')
    isValid = false
  } else {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = t('errors.invalidEmail')
      isValid = false
    }
  }

  if (!formData.phone) {
    errors.phone = t('errors.required')
    isValid = false
  }

  if (!formData.city) {
    errors.city = t('errors.required')
    isValid = false
  }

  if (!formData.vehicleType) {
    errors.vehicleType = t('errors.required')
    isValid = false
  }

  if (!formData.vehicleMake) {
    errors.vehicleMake = t('errors.required')
    isValid = false
  }

  if (!formData.vehicleModel) {
    errors.vehicleModel = t('errors.required')
    isValid = false
  }

  if (!formData.vehicleYear) {
    errors.vehicleYear = t('errors.required')
    isValid = false
  } else if (formData.vehicleYear < 1990 || formData.vehicleYear > currentYear) {
    errors.vehicleYear = t('driver.invalidVehicleYear')
    isValid = false
  }

  if (!formData.licensePlate) {
    errors.licensePlate = t('errors.required')
    isValid = false
  }

  if (!formData.driverLicense) {
    errors.driverLicense = t('errors.required')
    isValid = false
  }

  if (!formData.vehicleRegistration) {
    errors.vehicleRegistration = t('errors.required')
    isValid = false
  }

  if (!formData.insurance) {
    errors.insurance = t('errors.required')
    isValid = false
  }

  if (!formData.termsAgreement) {
    errors.termsAgreement = t('errors.termsRequired')
    isValid = false
  }

  return isValid
}

// Submit application
async function submitApplication() {
  if (!validateForm()) {
    // Scroll to the first error
    const firstError = document.querySelector('.error-message')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true

  try {
    // In a real app, this would call an API endpoint to submit the form
    // and upload the documents
    await new Promise(resolve => setTimeout(resolve, 2000))

    registrationCompleted.value = true
    // Scroll to top to see the success message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error submitting application:', error)
    alert(t('errors.somethingWentWrong'))
  } finally {
    isSubmitting.value = false
  }
}

// Navigate to homepage
function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.driver-signup-page {
  padding: 2rem 0;
}

.signup-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.signup-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
}

.signup-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.signup-benefits {
  display: flex;
  flex-direction: column;
}

.benefits-header {
  margin-bottom: 2rem;
}

.benefits-header h2 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.benefits-header p {
  color: #666;
  line-height: 1.6;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.benefit-item {
  display: flex;
  gap: 1rem;
}

.benefit-icon {
  width: 60px;
  height: 60px;
  background-color: #f7f0eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon i {
  font-size: 1.5rem;
  color: #f86906;
}

.benefit-content h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.benefit-content p {
  color: #666;
  line-height: 1.5;
}

.join-info {
  margin-top: auto;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.driver-app-img-placeholder {
  width: 250px;
  height: 500px;
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  border: 1px solid #ddd;
}

.driver-app-img-placeholder i {
  font-size: 48px;
  margin-bottom: 1rem;
}

.driver-app-img {
  width: 250px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.join-info-text {
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
}

.signup-form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.signup-form h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.form-section h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 500;
}

.docs-info {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, select:focus {
  border-color: #f86906;
  outline: none;
}

.file-input-wrapper {
  position: relative;
}

.file-selected {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f0f8ff;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  display: flex;
  align-items: center;
}

.file-selected i {
  color: #25b847;
  margin-right: 0.5rem;
}

.checkbox-group {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-top: 0.25rem;
}

.checkbox-label {
  line-height: 1.5;
  font-size: 0.9rem;
}

.checkbox-label a {
  color: #f86906;
  text-decoration: none;
}

.error-message {
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
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

.success-message {
  text-align: center;
  padding: 2rem 1rem;
}

.success-message i {
  font-size: 4rem;
  color: #25b847;
  margin-bottom: 1.5rem;
}

.success-message h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.success-message p {
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.next-steps {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 0.95rem;
}

.go-home-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.go-home-btn:hover {
  background-color: #e55c00;
}

@media (max-width: 992px) {
  .signup-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .join-info {
    display: none;
  }
}

@media (max-width: 768px) {
  .signup-header h1 {
    font-size: 2rem;
  }

  .benefit-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .benefit-content {
    text-align: center;
  }
}

@media (max-width: 576px) {
  .signup-header h1 {
    font-size: 1.75rem;
  }

  .signup-form-container {
    padding: 1.5rem;
  }

  .signup-form h2 {
    font-size: 1.25rem;
  }

  .form-section h3 {
    font-size: 1.1rem;
  }
}
</style>
