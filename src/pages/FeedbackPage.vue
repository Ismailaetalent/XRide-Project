<template>
  <div class="feedback-page">
    <div class="container">
      <div class="feedback-header">
        <h1>{{ $t('feedback.title') }}</h1>
        <p>{{ $t('feedback.subtitle') }}</p>
      </div>

      <div class="feedback-content">
        <div class="feedback-form-container">
          <div v-if="submissionStatus === 'success'" class="success-message">
            <i class="fas fa-check-circle"></i>
            <h2>{{ $t('feedback.thankYou') }}</h2>
            <p>{{ $t('feedback.submissionReceived') }}</p>
            <button class="new-feedback-btn" @click="resetForm">
              {{ $t('feedback.submitAnother') }}
            </button>
          </div>

          <form v-else @submit.prevent="submitFeedback" class="feedback-form">
            <div class="form-group">
              <label for="name">{{ $t('common.name') }}</label>
              <input
                id="name"
                v-model="feedbackForm.name"
                type="text"
                :placeholder="$t('common.name')"
              >
              <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            </div>

            <div class="form-group">
              <label for="email">{{ $t('common.email') }}</label>
              <input
                id="email"
                v-model="feedbackForm.email"
                type="email"
                :placeholder="$t('common.email')"
              >
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label for="feedback-type">{{ $t('feedback.feedbackType') }}</label>
              <select
                id="feedback-type"
                v-model="feedbackForm.type"
              >
                <option value="">{{ $t('feedback.selectType') }}</option>
                <option value="suggestion">{{ $t('feedback.suggestion') }}</option>
                <option value="compliment">{{ $t('feedback.compliment') }}</option>
                <option value="complaint">{{ $t('feedback.complaint') }}</option>
                <option value="other">{{ $t('feedback.other') }}</option>
              </select>
              <div v-if="errors.type" class="error-message">{{ errors.type }}</div>
            </div>

            <div v-if="feedbackForm.type === 'complaint'" class="form-group">
              <label for="order-id">{{ $t('feedback.orderId') }}</label>
              <input
                id="order-id"
                v-model="feedbackForm.orderId"
                type="text"
                :placeholder="$t('feedback.optionalOrderId')"
              >
            </div>

            <div class="form-group">
              <label for="subject">{{ $t('feedback.subject') }}</label>
              <input
                id="subject"
                v-model="feedbackForm.subject"
                type="text"
                :placeholder="$t('feedback.subjectPlaceholder')"
              >
              <div v-if="errors.subject" class="error-message">{{ errors.subject }}</div>
            </div>

            <div class="form-group">
              <label for="message">{{ $t('feedback.message') }}</label>
              <textarea
                id="message"
                v-model="feedbackForm.message"
                :placeholder="$t('feedback.messagePlaceholder')"
                rows="6"
              ></textarea>
              <div v-if="errors.message" class="error-message">{{ errors.message }}</div>
            </div>

            <div class="form-group rating-group">
              <label>{{ $t('feedback.rateExperience') }}</label>
              <div class="rating-stars">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="star-btn"
                  :class="{ 'active': star <= feedbackForm.rating }"
                  @click="feedbackForm.rating = star"
                >
                  <i class="fas fa-star"></i>
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting">{{ $t('common.loading') }}</span>
                <span v-else>{{ $t('feedback.submit') }}</span>
              </button>
            </div>
          </form>
        </div>

        <div class="feedback-info">
          <div class="testimonials">
            <h2>{{ $t('feedback.testimonials') }}</h2>

            <div class="testimonial-list">
              <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial">
                <div class="testimonial-header">
                  <div class="user-info">
                    <div class="user-avatar">{{ testimonial.initials }}</div>
                    <div class="user-details">
                      <h3>{{ testimonial.name }}</h3>
                      <div class="testimonial-rating">
                        <i
                          v-for="star in 5"
                          :key="star"
                          class="fas fa-star"
                          :class="{ 'filled': star <= testimonial.rating }"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div class="testimonial-date">{{ testimonial.date }}</div>
                </div>
                <p class="testimonial-text">{{ testimonial.text }}</p>
                <div class="testimonial-service">
                  <span>{{ testimonial.service }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-info">
            <h2>{{ $t('feedback.contactUs') }}</h2>
            <p>{{ $t('feedback.contactText') }}</p>
            <div class="contact-method">
              <i class="fas fa-envelope"></i>
              <span>feedback@gettransfer.com</span>
            </div>
            <div class="contact-method">
              <i class="fas fa-phone"></i>
              <span>+1-800-GET-RIDE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Form data
const feedbackForm = reactive({
  name: '',
  email: '',
  type: '',
  orderId: '',
  subject: '',
  message: '',
  rating: 0
})

// Form errors
const errors = reactive({
  name: '',
  email: '',
  type: '',
  subject: '',
  message: ''
})

// Submission state
const isSubmitting = ref(false)
const submissionStatus = ref('')

// Mock testimonials data
const testimonials = [
  {
    name: 'David Johnson',
    initials: 'DJ',
    rating: 5,
    date: 'April 10, 2025',
    text: t('feedback.testimonial1'),
    service: 'Airport Transfer - JFK to Manhattan'
  },
  {
    name: 'Sarah Williams',
    initials: 'SW',
    rating: 5,
    date: 'March 28, 2025',
    text: t('feedback.testimonial2'),
    service: 'Business Travel - London'
  },
  {
    name: 'Robert Chen',
    initials: 'RC',
    rating: 4,
    date: 'March 15, 2025',
    text: t('feedback.testimonial3'),
    service: 'City Tour - Paris'
  }
]

// Form validation
function validateForm() {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Validate name
  if (!feedbackForm.name) {
    errors.name = t('errors.required')
    isValid = false
  }

  // Validate email
  if (!feedbackForm.email) {
    errors.email = t('errors.required')
    isValid = false
  } else {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(feedbackForm.email)) {
      errors.email = t('errors.invalidEmail')
      isValid = false
    }
  }

  // Validate feedback type
  if (!feedbackForm.type) {
    errors.type = t('errors.required')
    isValid = false
  }

  // Validate subject
  if (!feedbackForm.subject) {
    errors.subject = t('errors.required')
    isValid = false
  }

  // Validate message
  if (!feedbackForm.message) {
    errors.message = t('errors.required')
    isValid = false
  } else if (feedbackForm.message.length < 10) {
    errors.message = t('feedback.messageTooShort')
    isValid = false
  }

  return isValid
}

// Submit feedback
async function submitFeedback() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // In a real app, this would call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Set success state
    submissionStatus.value = 'success'
  } catch (error) {
    console.error('Error submitting feedback:', error)
    alert(t('errors.somethingWentWrong'))
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
function resetForm() {
  feedbackForm.name = ''
  feedbackForm.email = ''
  feedbackForm.type = ''
  feedbackForm.orderId = ''
  feedbackForm.subject = ''
  feedbackForm.message = ''
  feedbackForm.rating = 0

  submissionStatus.value = ''
}
</script>

<style scoped>
.feedback-page {
  padding: 2rem 0;
}

.feedback-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.feedback-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.feedback-header p {
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.feedback-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.feedback-form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.success-message {
  text-align: center;
  padding: 3rem 1rem;
}

.success-message i {
  font-size: 4rem;
  color: #25b847;
  margin-bottom: 1rem;
}

.success-message h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.success-message p {
  color: #666;
  margin-bottom: 2rem;
}

.new-feedback-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.new-feedback-btn:hover {
  background-color: #e55c00;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #f86906;
  outline: none;
}

.error-message {
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.rating-group {
  margin-bottom: 2rem;
}

.rating-stars {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ddd;
  transition: color 0.2s ease;
  padding: 0;
}

.star-btn.active,
.star-btn:hover {
  color: #ffc107;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 0.75rem 2rem;
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

.feedback-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.testimonials h2,
.contact-info h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.25rem;
}

.testimonial-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.testimonial {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f86906;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.75rem;
}

.user-details h3 {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.25rem;
}

.testimonial-rating {
  display: flex;
  gap: 0.25rem;
  color: #ddd;
}

.testimonial-rating .filled {
  color: #ffc107;
}

.testimonial-date {
  font-size: 0.8rem;
  color: #999;
}

.testimonial-text {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.testimonial-service {
  font-size: 0.8rem;
  color: #999;
}

.testimonial-service span {
  padding: 0.25rem 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.contact-info {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.contact-info p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.contact-method {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.contact-method:last-child {
  margin-bottom: 0;
}

.contact-method i {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: #f86906;
}

@media (max-width: 992px) {
  .feedback-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .feedback-header h1 {
    font-size: 1.75rem;
  }

  .form-actions {
    justify-content: center;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
