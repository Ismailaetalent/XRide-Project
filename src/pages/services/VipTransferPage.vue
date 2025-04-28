<template>
  <div class="service-page vip-transfer-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ $t('services.vipTransferTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('services.vipTransferSubtitle') }}</p>

        <div class="booking-form-container">
          <div class="form-tabs">
            <button class="tab-button active">
              <i class="fas fa-crown"></i>
              {{ $t('services.vipTransfer') }}
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

            <button class="search-button" @click="searchVipTransfers">
              {{ $t('common.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.whyChooseOurVipTransfer') }}</h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-car-alt"></i>
            </div>
            <h3>{{ $t('services.luxuryVehicles') }}</h3>
            <p>{{ $t('services.luxuryVehiclesDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-user-tie"></i>
            </div>
            <h3>{{ $t('services.professionalDrivers') }}</h3>
            <p>{{ $t('services.professionalDriversDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-glass-martini-alt"></i>
            </div>
            <h3>{{ $t('services.additionalServices') }}</h3>
            <p>{{ $t('services.additionalServicesDesc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3>{{ $t('services.safetyAndPrivacy') }}</h3>
            <p>{{ $t('services.safetyAndPrivacyDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="vehicles-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.ourVipFleet') }}</h2>

        <div class="vehicles-grid">
          <div v-for="(vehicle, index) in vipVehicles" :key="index" class="vehicle-card">
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

    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">{{ $t('services.clientTestimonials') }}</h2>

        <div class="testimonials-grid">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-card">
            <div class="testimonial-rating">
              <i v-for="star in 5" :key="star" class="fas fa-star" :class="{ 'active': star <= testimonial.rating }"></i>
            </div>
            <p class="testimonial-text">{{ testimonial.text }}</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name">
              </div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">{{ $t('services.readyToExperienceVip') }}</h2>
        <p class="cta-subtitle">{{ $t('services.readyToExperienceVipDesc') }}</p>
        <button class="cta-button" @click="scrollToBookingForm">
          {{ $t('services.bookYourVipTransfer') }}
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

// Function to search for VIP transfers
function searchVipTransfers() {
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
    vehicle: 'vip'
  })

  // Navigate to booking page with query params
  router.push(`/transfer/new?${queryParams.toString()}`)
}

// VIP vehicles data
const vipVehicles = ref([
  {
    name: 'Mercedes-Benz S-Class',
    description: t('services.mercedesSDesc'),
    image: '../assets/vehicles/vip.svg',
    passengers: 3,
    luggage: 3
  },
  {
    name: 'BMW 7 Series',
    description: t('services.bmw7Desc'),
    image: '../assets/vehicles/vip.svg',
    passengers: 3,
    luggage: 3
  },
  {
    name: 'Audi A8',
    description: t('services.audiA8Desc'),
    image: '../assets/vehicles/vip.svg',
    passengers: 3,
    luggage: 3
  },
  {
    name: 'Tesla Model S',
    description: t('services.teslaDesc'),
    image: '../assets/vehicles/vip.svg',
    passengers: 3,
    luggage: 3
  }
])

// Testimonials data
const testimonials = ref([
  {
    rating: 5,
    text: t('services.testimonial1'),
    name: 'Robert Johnson',
    location: 'New York, USA',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    rating: 5,
    text: t('services.testimonial2'),
    name: 'Emma Williams',
    location: 'London, UK',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    rating: 4,
    text: t('services.testimonial3'),
    name: 'Michael Brown',
    location: 'Paris, France',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  }
])

// Function to book a specific vehicle
function bookVehicle(vehicle: any) {
  // Set VIP vehicle type and scroll to booking form
  scrollToBookingForm()
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
  background-color: #222021;
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

.search-button:hover {
  background-color: #e55e00;
}

.features-section,
.vehicles-section,
.testimonials-section {
  padding: 4rem 0;
}

.features-section {
  background-color: #f8f9fa;
}

.vehicles-section {
  background-color: white;
}

.testimonials-section {
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
  background-color: #f86906;
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
  background-color: #e55e00;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.testimonial-rating {
  margin-bottom: 1rem;
}

.testimonial-rating i {
  color: #ddd;
  font-size: 1rem;
  margin-right: 0.25rem;
}

.testimonial-rating i.active {
  color: #ffc107;
}

.testimonial-text {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  font-size: 1rem;
  margin: 0 0 0.25rem;
  color: #333;
}

.author-info p {
  font-size: 0.8rem;
  margin: 0;
  color: #888;
}

.cta-section {
  background-color: #222021;
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
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cta-button:hover {
  background-color: #e55e00;
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
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .cta-title {
    font-size: 1.75rem;
  }
}
</style>
