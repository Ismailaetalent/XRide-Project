<template>
  <div class="business-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ $t('business.title') }}</h1>
        <p class="hero-subtitle">{{ $t('business.subtitle') }}</p>

        <div class="cta-container">
          <button class="primary-button" @click="contactUs">
            {{ $t('business.contactUs') }}
          </button>
        </div>
      </div>
    </section>

    <section class="benefits-section">
      <div class="container">
        <h2 class="section-title">{{ $t('business.benefitsTitle') }}</h2>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-globe"></i>
            </div>
            <h3>{{ $t('business.globalCoverage') }}</h3>
            <p>{{ $t('business.globalCoverageDesc') }}</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-credit-card"></i>
            </div>
            <h3>{{ $t('business.easierPayments') }}</h3>
            <p>{{ $t('business.easierPaymentsDesc') }}</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>{{ $t('business.businessReports') }}</h3>
            <p>{{ $t('business.businessReportsDesc') }}</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-users"></i>
            </div>
            <h3>{{ $t('business.dedicatedManager') }}</h3>
            <p>{{ $t('business.dedicatedManagerDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">{{ $t('business.featuresTitle') }}</h2>

        <div class="features-list">
          <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>{{ $t('business.feature1') }}</span>
          </div>

          <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>{{ $t('business.feature2') }}</span>
          </div>

          <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>{{ $t('business.feature3') }}</span>
          </div>

          <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>{{ $t('business.feature4') }}</span>
          </div>

          <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>{{ $t('business.feature5') }}</span>
          </div>

          <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>{{ $t('business.feature6') }}</span>
          </div>
        </div>

        <div class="cta-container">
          <button class="primary-button" @click="contactUs">
            {{ $t('business.getStarted') }}
          </button>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <h2 class="section-title">{{ $t('business.contactTitle') }}</h2>

        <div class="contact-form">
          <div class="form-group">
            <label for="company">{{ $t('common.company') }}</label>
            <input type="text" id="company" v-model="contactForm.company">
          </div>

          <div class="form-group">
            <label for="name">{{ $t('common.name') }}</label>
            <input type="text" id="name" v-model="contactForm.name">
          </div>

          <div class="form-group">
            <label for="email">{{ $t('common.email') }}</label>
            <input type="email" id="email" v-model="contactForm.email">
          </div>

          <div class="form-group">
            <label for="phone">{{ $t('common.phone') }}</label>
            <input type="tel" id="phone" v-model="contactForm.phone">
          </div>

          <div class="form-group">
            <label for="message">{{ $t('common.message') }}</label>
            <textarea id="message" v-model="contactForm.message" rows="5"></textarea>
          </div>

          <button class="submit-button" @click="submitForm">
            {{ $t('common.send') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Contact form state
const contactForm = ref({
  company: '',
  name: '',
  email: '',
  phone: '',
  message: ''
})

function contactUs() {
  // Scroll to contact form section
  const contactSection = document.querySelector('.contact-section')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
  }
}

function submitForm() {
  // Validate form fields
  if (!contactForm.value.company || !contactForm.value.name || !contactForm.value.email) {
    alert(t('errors.required'))
    return
  }

  // In a real app, this would submit the form data to an API
  alert(t('business.thankYou'))

  // Reset the form
  contactForm.value = {
    company: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  }
}
</script>

<style scoped>
.business-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.hero-section {
  background-color: #f86906;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.benefits-section,
.features-section,
.contact-section {
  padding: 4rem 0;
}

.benefits-section {
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #333;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.benefit-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
}

.benefit-icon {
  font-size: 2.5rem;
  color: #f86906;
  margin-bottom: 1rem;
}

.benefit-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.benefit-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.feature-item i {
  color: #25b847;
  font-size: 1.2rem;
  margin-right: 1rem;
}

.cta-container {
  text-align: center;
  margin-top: 2rem;
}

.primary-button {
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-button:hover {
  background-color: #e55e00;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.submit-button {
  width: 100%;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #1e9e3e;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
