<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1>{{ $t('passenger.dashboard') }}</h1>
      <p class="welcome-message">{{ $t('passenger.welcomeMessage') }}, {{ authStore.userName }}</p>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin" />
      <p>{{ $t('common.loading') }}</p>
    </div>

    <template v-else>
      <div class="dashboard-summary">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-car" />
          </div>
          <div class="summary-content">
            <h3>{{ $t('passenger.upcomingRides') }}</h3>
            <p class="summary-number">{{ upcomingRides.length }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-history" />
          </div>
          <div class="summary-content">
            <h3>{{ $t('passenger.completedRides') }}</h3>
            <p class="summary-number">{{ completedRides.length }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-star" />
          </div>
          <div class="summary-content">
            <h3>{{ $t('passenger.averageRating') }}</h3>
            <p class="summary-number">{{ averageRating }}</p>
          </div>
        </div>
      </div>

      <div class="upcoming-rides">
        <div class="section-header">
          <h2>{{ $t('passenger.upcomingRides') }}</h2>
          <router-link to="/passenger/rides" class="view-all">
            {{ $t('passenger.viewAll') }}
          </router-link>
        </div>

        <div v-if="upcomingRides.length === 0" class="empty-state">
          <p>{{ $t('passenger.noUpcomingRides') }}</p>
          <router-link to="/transfer/new" class="book-button">
            {{ $t('passenger.bookNow') }}
          </router-link>
        </div>

        <div v-else class="rides-list">
          <div
            v-for="ride in upcomingRides"
            :key="ride.id"
            class="ride-card"
            @click="viewRideDetails(ride.id)"
          >
            <div class="ride-info">
              <div class="ride-date">
                <span class="date">{{ formatDate(ride.date) }}</span>
                <span class="time">{{ ride.time }}</span>
              </div>
              <div class="ride-details">
                <div class="ride-locations">
                  <div class="pickup">
                    <i class="fas fa-map-marker-alt pickup-icon" />
                    <span>{{ ride.pickup.address }}</span>
                  </div>
                  <div class="destination">
                    <i class="fas fa-map-marker-alt destination-icon" />
                    <span>{{ ride.destination.address }}</span>
                  </div>
                </div>
                <div class="ride-vehicle">
                  <i :class="getVehicleIcon(ride.vehicle.type)" />
                  <span>{{ ride.vehicle.name }}</span>
                </div>
              </div>
              <div class="ride-price">
                <span>{{ formatPrice(ride.price) }}</span>
              </div>
            </div>
            <div class="ride-actions">
              <button class="cancel-button" @click.stop="cancelRide(ride.id)">
                {{ $t('passenger.cancel') }}
              </button>
              <button v-if="ride.driverId" class="contact-button" @click.stop="contactDriver(ride.id)">
                {{ $t('passenger.contactDriver') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-book">
        <div class="section-header">
          <h2>{{ $t('passenger.quickBook') }}</h2>
        </div>

        <div class="quick-book-form">
          <div class="form-row">
            <div class="input-group">
              <label for="pickup">{{ $t('common.from') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-start" />
                <input
                  id="pickup"
                  v-model="quickBookForm.pickup"
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
                  v-model="quickBookForm.destination"
                  type="text"
                  :placeholder="$t('common.to')"
                >
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="input-group">
              <label for="date">{{ $t('common.date') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-calendar" />
                <input
                  id="date"
                  v-model="quickBookForm.date"
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
                  v-model="quickBookForm.time"
                  type="time"
                >
              </div>
            </div>

            <div class="input-group">
              <label for="vehicleType">{{ $t('common.vehicleType') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-car" />
                <select
                  id="vehicleType"
                  v-model="quickBookForm.vehicleType"
                >
                  <option
                    v-for="vehicle in availableVehicles"
                    :key="vehicle.id"
                    :value="vehicle.id"
                  >
                    {{ vehicle.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <button class="book-button" @click="quickBook">
            {{ $t('passenger.bookNow') }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore'
import { useBookingStore } from '../../stores/useBookingStore'
import { bookingService } from '../../services'
import type { BookingDetails } from '../../types'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const bookingStore = useBookingStore()

// Loading state
const loading = ref(true)

// Quick book form
const quickBookForm = ref({
  pickup: '',
  destination: '',
  date: getTodayDate(),
  time: getCurrentTime(),
  vehicleType: 'economy'
})

// Available vehicles
const availableVehicles = ref([])

// Bookings data
const allBookings = ref<BookingDetails[]>([])

// Computed properties for filtered bookings
const upcomingRides = computed(() => {
  return allBookings.value.filter(booking =>
    booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'in_progress'
  ).sort((a, b) => {
    // Sort by date and time, earliest first
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  }).slice(0, 3) // Show max 3 rides
})

const completedRides = computed(() => {
  return allBookings.value.filter(booking => booking.status === 'completed')
})

// Calculate average rating
const averageRating = computed(() => {
  const completedRidesWithRating = completedRides.value.filter(ride => ride.userRating)
  if (completedRidesWithRating.length === 0) return '0.0'

  const totalRating = completedRidesWithRating.reduce(
    (sum, ride) => sum + (ride.userRating || 0), 0
  )
  return (totalRating / completedRidesWithRating.length).toFixed(1)
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

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Format price for display
function formatPrice(price: number | undefined) {
  if (price === undefined) return '$0.00'
  return `$${price.toFixed(2)}`
}

// Get vehicle icon based on type
function getVehicleIcon(vehicleType: string) {
  switch (vehicleType) {
    case 'economy':
    case 'comfort':
      return 'fas fa-car'
    case 'business':
    case 'premium':
    case 'vip':
      return 'fas fa-car-side'
    case 'suv':
      return 'fas fa-truck'
    case 'van':
    case 'minibus':
      return 'fas fa-shuttle-van'
    case 'bus':
      return 'fas fa-bus'
    default:
      return 'fas fa-car'
  }
}

// View ride details
function viewRideDetails(rideId: number) {
  router.push(`/passenger/rides/${rideId}`)
}

// Cancel ride
async function cancelRide(rideId: number) {
  if (window.confirm(t('passenger.confirmCancel'))) {
    try {
      await bookingStore.cancelBooking(rideId)
      // Update the local list after cancellation
      loadBookings()
      alert(t('passenger.rideCancelled'))
    } catch (error) {
      console.error('Error cancelling ride:', error)
      alert(t('errors.cancelFailed'))
    }
  }
}

// Contact driver
function contactDriver(rideId: number) {
  const ride = allBookings.value.find(r => r.id === rideId)
  if (ride?.driverPhone) {
    alert(`${t('passenger.callingDriver')}: ${ride.driverPhone}`)
  } else {
    alert(t('errors.driverContactNotAvailable'))
  }
}

// Quick book function
function quickBook() {
  if (!quickBookForm.value.pickup || !quickBookForm.value.destination) {
    alert(t('errors.required'))
    return
  }

  // Navigate to the booking page with the form data
  router.push({
    path: '/transfer/new',
    query: {
      pickup: quickBookForm.value.pickup,
      destination: quickBookForm.value.destination,
      date: quickBookForm.value.date,
      time: quickBookForm.value.time,
      vehicle: quickBookForm.value.vehicleType
    }
  })
}

// Load bookings from service
async function loadBookings() {
  try {
    const bookings = await bookingService.getUserBookings()
    allBookings.value = bookings
  } catch (error) {
    console.error('Error loading bookings:', error)
  }
}

// Load available vehicles
async function loadVehicles() {
  try {
    const vehicles = await bookingService.getVehicleTypes()
    availableVehicles.value = vehicles
  } catch (error) {
    console.error('Error loading vehicles:', error)
  }
}

// Load data when component is mounted
onMounted(async () => {
  try {
    await Promise.all([
      loadBookings(),
      loadVehicles()
    ])
  } catch (error) {
    console.error('Error initializing dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard-page {
  padding: 1.5rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.welcome-message {
  font-size: 1rem;
  color: #666;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-state i {
  font-size: 2.5rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-icon {
  font-size: 1.75rem;
  color: #f86906;
  margin-right: 1rem;
}

.summary-content h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
  font-weight: 400;
}

.summary-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h2 {
  font-size: 1.25rem;
  color: #333;
}

.view-all {
  color: #f86906;
  text-decoration: none;
  font-size: 0.9rem;
}

.upcoming-rides {
  margin-bottom: 2.5rem;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  color: #666;
  margin-bottom: 1rem;
}

.rides-list {
  display: grid;
  gap: 1rem;
}

.ride-card {
  padding: 1.25rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.ride-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ride-info {
  display: flex;
  margin-bottom: 1rem;
}

.ride-date {
  min-width: 100px;
  padding-right: 1rem;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.date {
  font-weight: 500;
  color: #333;
}

.time {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.ride-details {
  flex: 1;
  padding: 0 1rem;
}

.ride-locations {
  margin-bottom: 0.5rem;
}

.pickup, .destination {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.pickup-icon, .destination-icon {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.pickup-icon {
  color: #f86906;
}

.destination-icon {
  color: #25b847;
}

.ride-vehicle {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.ride-vehicle i {
  margin-right: 0.5rem;
}

.ride-price {
  min-width: 80px;
  text-align: right;
  font-weight: 600;
  color: #333;
}

.ride-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button, .contact-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #666;
}

.contact-button {
  background-color: #f86906;
  color: white;
}

.quick-book {
  margin-bottom: 2rem;
}

.quick-book-form {
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group {
  width: 100%;
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

.input-with-icon input,
.input-with-icon select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.input-with-icon select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8.825L1.175 4 2.6 2.575 6 5.975 9.4 2.575 10.825 4 6 8.825z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
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

.book-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.book-button:hover {
  background-color: #1e9e3e;
}

@media (max-width: 768px) {
  .ride-info {
    flex-direction: column;
  }

  .ride-date {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .ride-price {
    margin-top: 0.5rem;
    text-align: left;
  }

  .ride-details {
    padding: 0;
  }
}

@media (max-width: 576px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
  }

  .ride-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .cancel-button,
  .contact-button {
    width: 100%;
  }
}
</style>
