<template>
  <div class="service-page bus-rental-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ $t('services.busRentalTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('services.busRentalSubtitle') }}</p>

        <div class="booking-form-container">
          <div class="form-tabs">
            <button class="tab-button active">
              <i class="fas fa-bus"></i>
              {{ $t('services.busRental') }}
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

            <div class="form-group">
              <label for="passengers">{{ $t('common.passengers') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-users"></i>
                <input
                  id="passengers"
                  v-model.number="bookingForm.passengers"
                  type="number"
                  min="1"
                  max="100"
                >
              </div>
            </div>

            <button class="search-button" @click="searchBusRentals">
              {{ $t('common.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.whyChooseOurBusRental') }}</h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <h3>{{ $t('services.groupTransportation') }}</h3>
            <p>{{ $t('services.groupTransportationDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <h3>{{ $t('services.costEfficient') }}</h3>
            <p>{{ $t('services.costEfficientDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-route"></i>
            </div>
            <h3>{{ $t('services.customItinerary') }}</h3>
            <p>{{ $t('services.customItineraryDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-user-tie"></i>
            </div>
            <h3>{{ $t('services.professionalDrivers') }}</h3>
            <p>{{ $t('services.professionalDriversDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="vehicles-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.ourBusFleet') }}</h2>

        <div class="vehicles-grid">
          <div v-for="(vehicle, index) in busVehicles" :key="index" class="vehicle-card">
            <div class="vehicle-image">
              <img :src="vehicle.image" :alt="vehicle.name">
            </div>
            <div class="vehicle-info">
              <h3>{{ vehicle.name }}</h3>
              <p class="vehicle-description">{{ vehicle.description }}</p>
              <div class="vehicle-features">
                <div class="feature">
                  <i class="fas fa-users"></i>
                  <span>{{ vehicle.passengers }} {{ $t('common.passengers') }}</span>
                </div>
                <div class="feature">
                  <i class="fas fa-suitcase"></i>
                  <span>{{ vehicle.luggage }} {{ $t('common.luggage') }}</span>
                </div>
              </div>
              <button class="book-now-btn" @click="bookVehicle(vehicle)">
                {{ $t('services.bookNow') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="use-cases-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.busRentalUseCases') }}</h2>

        <div class="use-cases-grid">
          <div class="use-case-card">
            <div class="use-case-icon">
              <i class="fas fa-suitcase-rolling"></i>
            </div>
            <h3>{{ $t('services.airportTransfers') }}</h3>
            <p>{{ $t('services.airportTransfersGroupDesc') }}</p>
          </div>

          <div class="use-case-card">
            <div class="use-case-icon">
              <i class="fas fa-glass-cheers"></i>
            </div>
            <h3>{{ $t('services.eventsAndConferences') }}</h3>
            <p>{{ $t('services.eventsAndConferencesDesc') }}</p>
          </div>

          <div class="use-case-card">
            <div class="use-case-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <h3>{{ $t('services.schoolTrips') }}</h3>
            <p>{{ $t('services.schoolTripsDesc') }}</p>
          </div>

          <div class="use-case-card">
            <div class="use-case-icon">
              <i class="fas fa-plane-departure"></i>
            </div>
            <h3>{{ $t('services.tourGroups') }}</h3>
            <p>{{ $t('services.tourGroupsDesc') }}</p>
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

    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">{{ $t('services.readyToBookBus') }}</h2>
        <p class="cta-subtitle">{{ $t('services.readyToBookBusDesc') }}</p>
        <button class="cta-button" @click="scrollToBookingForm">
          {{ $t('services.bookYourBusNow') }}
        </button>
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
  time: getCurrentTime(),
  passengers: 20
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

// Function to search for bus rentals
function searchBusRentals() {
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
    passengers: bookingForm.value.passengers.toString(),
    vehicle: 'bus'
  })

  // Navigate to booking page with query params
  router.push(`/transfer/new?${queryParams.toString()}`)
}

// Bus vehicles data
const busVehicles = ref([
  {
    name: t('services.minibusName'),
    description: t('services.minibusDesc'),
    image: '../assets/vehicles/minibus.svg',
    passengers: 16,
    luggage: 16
  },
  {
    name: t('services.midsizeBusName'),
    description: t('services.midsizeBusDesc'),
    image: '../assets/vehicles/bus.svg',
    passengers: 30,
    luggage: 30
  },
  {
    name: t('services.coachBusName'),
    description: t('services.coachBusDesc'),
    image: '../assets/vehicles/bus.svg',
    passengers: 50,
    luggage: 50
  }
])

// FAQs state
const faqs = ref([
  {
    question: t('services.busRentalFaq1'),
    answer: t('services.busRentalFaq1Answer'),
    open: false
  },
  {
    question: t('services.busRentalFaq2'),
    answer: t('services.busRentalFaq2Answer'),
    open: false
  },
  {
    question: t('services.busRentalFaq3'),
    answer: t('services.busRentalFaq3Answer'),
    open: false
  },
  {
    question: t('services.busRentalFaq4'),
    answer: t('services.busRentalFaq4Answer'),
    open: false
  }
])

// Function to book a specific vehicle
function bookVehicle(vehicle: any) {
  // Set passenger count based on vehicle capacity
  bookingForm.value.passengers = vehicle.passengers

  // Scroll to booking form
  scrollToBookingForm()
}

// Function to toggle FAQ item
function toggleFaq(index: number) {
  faqs.value[index].open = !faqs.value[index].open
}

// Function to scroll to booking form
function scrollToBookingForm() {
  const bookingFormElement = document.querySelector('.booking-form-container')
  if (bookingFormElement) {
    bookingFormElement.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.service-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.hero-section {
  background-color: #25b847;
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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
  background-color: #25b847;
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
.vehicles-section,
.use-cases-section,
.faq-section {
  padding: 4rem 0;
}

.features-section {
  background-color: #f8f9fa;
}

.vehicles-section {
  background-color: white;
}

.use-cases-section {
  background-color: #f8f9fa;
}

.faq-section {
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid,
.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card,
.use-case-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.feature-card:hover,
.use-case-card:hover {
  transform: translateY(-5px);
}

.feature-icon,
.use-case-icon {
  font-size: 2.5rem;
  color: #25b847;
  margin-bottom: 1rem;
}

.feature-card h3,
.use-case-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-card p,
.use-case-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.vehicle-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.vehicle-card:hover {
  transform: translateY(-5px);
}

.vehicle-image {
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.vehicle-image img {
  width: 80%;
  height: auto;
  object-fit: contain;
}

.vehicle-info {
  padding: 1.5rem;
}

.vehicle-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.vehicle-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.vehicle-features {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.vehicle-features .feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.book-now-btn {
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.book-now-btn:hover {
  background-color: #1e9e3e;
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

.cta-section {
  background-color: #25b847;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  background-color: white;
  color: #25b847;
  border: none;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cta-button:hover {
  background-color: #f1f1f1;
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
  .vehicles-grid,
  .use-cases-grid {
    grid-template-columns: 1fr;
  }

  .cta-title {
    font-size: 1.75rem;
  }
}
</style>
