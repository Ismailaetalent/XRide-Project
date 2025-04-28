<template>
  <div class="agents-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ $t('agents.title') }}</h1>
        <p class="hero-subtitle">{{ $t('agents.subtitle') }}</p>

        <div class="cta-container">
          <button class="primary-button" @click="registerAsAgent">
            {{ $t('agents.register') }}
          </button>
        </div>
      </div>
    </section>

    <section class="benefits-section">
      <div class="container">
        <h2 class="section-title">{{ $t('agents.benefitsTitle') }}</h2>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-globe"></i>
            </div>
            <h3>{{ $t('agents.globalNetwork') }}</h3>
            <p>{{ $t('agents.globalNetworkDesc') }}</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-wallet"></i>
            </div>
            <h3>{{ $t('agents.extraIncome') }}</h3>
            <p>{{ $t('agents.extraIncomeDesc') }}</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-tools"></i>
            </div>
            <h3>{{ $t('agents.allTools') }}</h3>
            <p>{{ $t('agents.allToolsDesc') }}</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h3>{{ $t('agents.support247') }}</h3>
            <p>{{ $t('agents.support247Desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">{{ $t('agents.howItWorksTitle') }}</h2>

        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>{{ $t('agents.step1Title') }}</h3>
            <p>{{ $t('agents.step1Desc') }}</p>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <h3>{{ $t('agents.step2Title') }}</h3>
            <p>{{ $t('agents.step2Desc') }}</p>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <h3>{{ $t('agents.step3Title') }}</h3>
            <p>{{ $t('agents.step3Desc') }}</p>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <h3>{{ $t('agents.step4Title') }}</h3>
            <p>{{ $t('agents.step4Desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="commission-section">
      <div class="container">
        <h2 class="section-title">{{ $t('agents.commissionTitle') }}</h2>

        <div class="commission-table-container">
          <table class="commission-table">
            <thead>
              <tr>
                <th>{{ $t('agents.serviceType') }}</th>
                <th>{{ $t('agents.commissionRate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $t('services.airportTransfer') }}</td>
                <td>10%</td>
              </tr>
              <tr>
                <td>{{ $t('services.vipTransfer') }}</td>
                <td>12%</td>
              </tr>
              <tr>
                <td>{{ $t('services.busRental') }}</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>{{ $t('services.carRental') }}</td>
                <td>8%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="commission-note">{{ $t('agents.commissionNote') }}</p>
      </div>
    </section>

    <section class="registration-section">
      <div class="container">
        <h2 class="section-title">{{ $t('agents.registrationTitle') }}</h2>

        <div class="registration-form">
          <div class="form-group">
            <label for="company">{{ $t('common.company') }}</label>
            <input type="text" id="company" v-model="registrationForm.company">
          </div>

          <div class="form-group">
            <label for="name">{{ $t('common.name') }}</label>
            <input type="text" id="name" v-model="registrationForm.name">
          </div>

          <div class="form-group">
            <label for="email">{{ $t('common.email') }}</label>
            <input type="email" id="email" v-model="registrationForm.email">
          </div>

          <div class="form-group">
            <label for="phone">{{ $t('common.phone') }}</label>
            <input type="tel" id="phone" v-model="registrationForm.phone">
          </div>

          <div class="form-group">
            <label for="country">{{ $t('common.country') }}</label>
            <select id="country" v-model="registrationForm.country">
              <option value="">{{ $t('common.selectCountry') }}</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="RU">Russia</option>
              <option value="CN">China</option>
              <option value="JP">Japan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">{{ $t('common.message') }}</label>
            <textarea id="message" v-model="registrationForm.message" rows="5"></textarea>
          </div>

          <div class="form-group checkbox-group">
            <input type="checkbox" id="terms" v-model="registrationForm.termsAccepted">
            <label for="terms" class="checkbox-label">
              {{ $t('agents.termsAccepted') }} <router-link to="/terms">{{ $t('common.termsAndConditions') }}</router-link>
            </label>
          </div>

          <button class="submit-button" @click="submitRegistration" :disabled="!registrationForm.termsAccepted">
            {{ $t('agents.submitRegistration') }}
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

// Registration form state
const registrationForm = ref({
  company: '',
  name: '',
  email: '',
  phone: '',
  country: '',
  message: '',
  termsAccepted: false
})

function registerAsAgent() {
  // Scroll to registration form section
  const registrationSection = document.querySelector('.registration-section')
  if (registrationSection) {
    registrationSection.scrollIntoView({ behavior: 'smooth' })
  }
}

function submitRegistration() {
  // Validate form fields
  if (!registrationForm.value.company || !registrationForm.value.name || !registrationForm.value.email || !registrationForm.value.country) {
    alert(t('errors.required'))
    return
  }

  if (!registrationForm.value.termsAccepted) {
    alert(t('errors.termsRequired'))
    return
  }

  // In a real app, this would submit the form data to an API
  alert(t('agents.registrationSuccess'))

  // Reset the form
  registrationForm.value = {
    company: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    termsAccepted: false
  }
}
</script>

<style scoped>
.agents-page {
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
.how-it-works-section,
.commission-section,
.registration-section {
  padding: 4rem 0;
}

.benefits-section {
  background-color: #f8f9fa;
}

.how-it-works-section {
  background-color: white;
}

.commission-section {
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

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-number {
  background-color: #f86906;
  color: white;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.step h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.step p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.commission-table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.commission-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.commission-table th,
.commission-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.commission-table th {
  background-color: #f86906;
  color: white;
  font-weight: 500;
}

.commission-table tbody tr:hover {
  background-color: #f5f5f5;
}

.commission-note {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
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

.registration-form {
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
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: inline;
  margin: 0;
}

.checkbox-label a {
  color: #f86906;
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

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
