<template>
  <div class="service-page airport-transfer-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ $t('services.airportTransferTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('services.airportTransferSubtitle') }}</p>

        <div class="booking-form-container">
          <div class="form-tabs">
            <button class="tab-button active">
              <i class="fas fa-plane-arrival"></i>
              {{ $t('services.airportTransfer') }}
            </button>
          </div>

          <div class="booking-form">
            <div class="form-group">
              <label for="pickup">{{ $t('common.from') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-start"></i>
                <input
                  id="pickup"
                  v-model="bookingForm.pickup"
                  type="text"
                  :placeholder="$t('common.from')"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="destination">{{ $t('common.to') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-end"></i>
                <input
                  id="destination"
                  v-model="bookingForm.destination"
                  type="text"
                  :placeholder="$t('common.to')"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="date">{{ $t('common.date') }}</label>
                <div class="input-with-icon">
                  <i class="fas fa-calendar"></i>
                  <input
                    id="date"
                    v-model="bookingForm.date"
                    type="date"
                    :min="getTodayDate()"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="time">{{ $t('common.time') }}</label>
                <div class="input-with-icon">
                  <i class="fas fa-clock"></i>
                  <input
                    id="time"
                    v-model="bookingForm.time"
                    type="time"
                  >
                </div>
              </div>
            </div>

            <button class="search-button" @click="searchAirportTransfers">
              {{ $t('common.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.whyChooseOurAirportTransfer') }}</h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-clock"></i>
            </div>
            <h3>{{ $t('services.flightTracking') }}</h3>
            <p>{{ $t('services.flightTrackingDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-hourglass-half"></i>
            </div>
            <h3>{{ $t('services.waitingTime') }}</h3>
            <p>{{ $t('services.waitingTimeDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3>{{ $t('services.fixedPrice') }}</h3>
            <p>{{ $t('services.fixedPriceDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-map-marked-alt"></i>
            </div>
            <h3>{{ $t('services.doorToDoor') }}</h3>
            <p>{{ $t('services.doorToDoorDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.howItWorks') }}</h2>

        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>{{ $t('services.bookYourTransfer') }}</h3>
            <p>{{ $t('services.bookYourTransferDesc') }}</p>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <h3>{{ $t('services.meetYourDriver') }}</h3>
            <p>{{ $t('services.meetYourDriverDesc') }}</p>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <h3>{{ $t('services.enjoyTheRide') }}</h3>
            <p>{{ $t('services.enjoyTheRideDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="popular-airports-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.popularAirports') }}</h2>

        <div class="airports-grid">
          <div v-for="airport in popularAirports" :key="airport.code" class="airport-card">
            <h3>{{ airport.name }}</h3>
            <p>{{ airport.city }}, {{ airport.country }}</p>
            <button class="book-now-btn" @click="bookAirport(airport)">
              {{ $t('services.bookNow') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.frequentlyAskedQuestions') }}</h2>

        <div class="faq-list">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ faq.question }}</h3>
              <i class="fas" :class="faq.open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-show="faq.open">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// Booking form state
const bookingForm = ref({
  pickup: '',
  destination: '',
  date: getTodayDate(),
  time: getCurrentTime()
})

// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Function to get current time in HH:MM format
function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// Function to search for airport transfers
function searchAirportTransfers() {
  if (!bookingForm.value.pickup || !bookingForm.value.destination) {
    alert(t('errors.required'))
    return
  }

  // Construct query params for the search
  const queryParams = new URLSearchParams({
    type: 'ride',
    pickup: bookingForm.value.pickup,
    destination: bookingForm.value.destination,
    date: bookingForm.value.date,
    time: bookingForm.value.time,
    service: 'airport'
  })

  // Navigate to booking page with query params
  router.push(`/transfer/new?${queryParams.toString()}`)
}

// Popular airports data
const popularAirports = ref([
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA'
  },
  {
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'UK'
  },
  {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France'
  },
  {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'UAE'
  },
  {
    code: 'HND',
    name: 'Haneda Airport',
    city: 'Tokyo',
    country: 'Japan'
  },
  {
    code: 'FCO',
    name: 'Leonardo da Vinci International Airport',
    city: 'Rome',
    country: 'Italy'
  }
])

// Function to book a specific airport
function bookAirport(airport: any) {
  bookingForm.value.pickup = `${airport.name} (${airport.code})`

  // Scroll to booking form
  const bookingForm = document.querySelector('.booking-form-container')
  if (bookingForm) {
    bookingForm.scrollIntoView({ behavior: 'smooth' })
  }
}

// FAQs state
const faqs = ref([
  {
    question: t('services.faqQuestion1'),
    answer: t('services.faqAnswer1'),
    open: false
  },
  {
    question: t('services.faqQuestion2'),
    answer: t('services.faqAnswer2'),
    open: false
  },
  {
    question: t('services.faqQuestion3'),
    answer: t('services.faqAnswer3'),
    open: false
  },
  {
    question: t('services.faqQuestion4'),
    answer: t('services.faqAnswer4'),
    open: false
  },
  {
    question: t('services.faqQuestion5'),
    answer: t('services.faqAnswer5'),
    open: false
  }
])

// Toggle FAQ item
function toggleFaq(index: number) {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<style scoped>
.service-page {
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

.booking-form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-button.active {
  background-color: #f86906;
  color: white;
}

.booking-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-with-icon i {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #999;
}

.icon-start {
  color: #f86906 !important;
}

.icon-end {
  color: #25b847 !important;
}

.search-button {
  width: 100%;
  padding: 1rem;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.search-button:hover {
  background-color: #1e9e3e;
}

.features-section,
.how-it-works-section,
.popular-airports-section,
.faq-section {
  padding: 4rem 0;
}

.features-section {
  background-color: #f8f9fa;
}

.how-it-works-section {
  background-color: white;
}

.popular-airports-section {
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: #f86906;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.airports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.airport-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.airport-card:hover {
  transform: translateY(-5px);
}

.airport-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.airport-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.book-now-btn {
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.book-now-btn:hover {
  background-color: #e55e00;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  background-color: white;
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #333;
}

.faq-answer {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.faq-answer p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .features-grid,
  .steps,
  .airports-grid {
    grid-template-columns: 1fr;
  }
}
</style>
