<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">{{ $t('home.title') }}</h1>

        <div class="booking-form-container">
          <!-- Booking form tabs -->
          <div class="booking-tabs">
            <button
              class="tab-button"
              :class="{ 'active': bookingType === 'ride' }"
              @click="bookingType = 'ride'"
            >
              <i class="fas fa-car" />
              {{ $t('booking.rideType') }}
            </button>
            <button
              class="tab-button"
              :class="{ 'active': bookingType === 'hourly' }"
              @click="bookingType = 'hourly'"
            >
              <i class="fas fa-clock" />
              {{ $t('booking.perHour') }}
            </button>
          </div>

          <!-- Booking form -->
          <div class="booking-form">
            <div class="input-group">
              <label for="pickup">{{ $t('common.from') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-start" />
                <input
                  id="pickup"
                  v-model="bookingForm.pickup"
                  type="text"
                  :placeholder="$t('common.from')"
                >
              </div>
            </div>

            <div class="input-group">
              <label for="destination">{{ $t('common.to') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-end" />
                <input
                  id="destination"
                  v-model="bookingForm.destination"
                  type="text"
                  :placeholder="$t('common.to')"
                >
              </div>
            </div>

            <div class="input-row">
              <div class="input-group">
                <label for="date">{{ $t('common.date') }}</label>
                <div class="input-with-icon">
                  <i class="fas fa-calendar" />
                  <input
                    id="date"
                    v-model="bookingForm.date"
                    type="date"
                    :min="getTodayDate()"
                  >
                </div>
              </div>

              <div class="input-group">
                <label for="time">{{ $t('common.time') }}</label>
                <div class="input-with-icon">
                  <i class="fas fa-clock" />
                  <input
                    id="time"
                    v-model="bookingForm.time"
                    type="time"
                  >
                </div>
              </div>
            </div>

            <button class="search-button" @click="searchRides">
              {{ $t('common.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <div class="features">
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-thumbs-up" />
            </div>
            <h3>{{ $t('home.priceMatch') }}</h3>
            <p>{{ $t('home.priceMatchDesc') }}</p>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-hourglass-half" />
            </div>
            <h3>{{ $t('home.freeWaiting') }}</h3>
            <p>{{ $t('home.freeWaitingDesc') }}</p>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-dollar-sign" />
            </div>
            <h3>{{ $t('home.noHidden') }}</h3>
            <p>{{ $t('home.noHiddenDesc') }}</p>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-shield-alt" />
            </div>
            <h3>{{ $t('home.safeRides') }}</h3>
            <p>{{ $t('home.safeRidesDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="fleet-section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.ourFleet') }}</h2>

        <div class="fleet-gallery">
          <div class="vehicle-card" @click="selectVehicleType('economy')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/economy.svg" alt="Economy">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.economy') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('comfort')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/comfort.svg" alt="Comfort">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.comfort') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('business')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/business.svg" alt="Business">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.business') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('premium')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/premium.svg" alt="Premium">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.premium') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('vip')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/vip.svg" alt="VIP">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.vip') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('suv')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/suv.svg" alt="SUV">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.suv') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('van')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/van.svg" alt="Van">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.van') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('minibus')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/minibus.svg" alt="Minibus">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.minibus') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('bus')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/bus.svg" alt="Bus">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.bus') }}</h3>
            </div>
          </div>

          <div class="vehicle-card" @click="selectVehicleType('parcel')">
            <div class="vehicle-image">
              <img src="../assets/vehicles/parcel.svg" alt="Parcel">
            </div>
            <div class="vehicle-info">
              <h3>{{ $t('booking.parcel') }}</h3>
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

const { t } = useI18n()
const router = useRouter()

// Booking form state
const bookingType = ref('ride')
const bookingForm = ref({
  pickup: '',
  destination: '',
  date: getTodayDate(),
  time: getCurrentTime(),
  vehicleType: 'economy',
  passengers: 1,
  luggage: 0
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

// Function to select vehicle type
function selectVehicleType(type: string) {
  bookingForm.value.vehicleType = type

  // Construct query params for the search
  const queryParams = new URLSearchParams({
    type: bookingType.value,
    pickup: bookingForm.value.pickup,
    destination: bookingForm.value.destination,
    date: bookingForm.value.date,
    time: bookingForm.value.time,
    vehicle: type
  })

  // Navigate to booking page with query params
  router.push(`transfer/new?${queryParams.toString()}`)
}

// Function to search for rides
function searchRides() {
  if (!bookingForm.value.pickup || !bookingForm.value.destination) {
    // Show validation error
    alert(t('errors.required'))
    return
  }

  // Construct query params for the search
  const queryParams = new URLSearchParams({
    type: bookingType.value,
    pickup: bookingForm.value.pickup,
    destination: bookingForm.value.destination,
    date: bookingForm.value.date,
    time: bookingForm.value.time,
    vehicle: bookingForm.value.vehicleType
  })

  // Navigate to booking page with query params
  router.push(`transfer/new?${queryParams.toString()}`)
}
</script>

<style scoped>
.home-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero-section {
  background-color: #f86906;
  padding: 3rem 0 4rem;
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
}

.booking-form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.booking-tabs {
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

.input-group {
  margin-bottom: 1rem;
}

.input-row {
  display: flex;
  gap: 1rem;
}

.input-row .input-group {
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
}

.search-button:hover {
  background-color: #1e9e3e;
}

/* Features Section */
.features-section {
  padding: 4rem 0;
  background-color: #fff;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature {
  text-align: center;
}

.feature-icon {
  font-size: 2rem;
  color: #f86906;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Fleet Section */
.fleet-section {
  padding: 3rem 0 5rem;
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.fleet-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.vehicle-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vehicle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.vehicle-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f8f9fa;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.vehicle-info {
  padding: 1rem;
  text-align: center;
}

.vehicle-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .input-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .tab-button {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .booking-form {
    padding: 1rem;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}
</style>
