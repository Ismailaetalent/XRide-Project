<template>
  <div class="ride-details-page">
    <div class="page-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-chevron-left" />
        {{ $t('common.back') }}
      </button>
      <h1>{{ $t('passenger.rideDetails') }}</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin" />
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!ride" class="error-state">
      <i class="fas fa-exclamation-circle" />
      <p>{{ $t('errors.rideNotFound') }}</p>
      <router-link to="/passenger/rides" class="back-link">
        {{ $t('passenger.allRides') }}
      </router-link>
    </div>

    <div v-else class="ride-content">
      <div class="ride-status-bar">
        <div class="ride-status" :class="ride.status">
          {{ $t(`passenger.${ride.status}`) }}
        </div>
        <div class="ride-id">
          {{ $t('passenger.rideId') }}: {{ ride.id }}
        </div>
      </div>

      <div class="ride-overview">
        <div class="pickup-destination">
          <div class="location-point pickup">
            <div class="location-icon">
              <i class="fas fa-map-marker-alt" />
            </div>
            <div class="location-details">
              <h3>{{ $t('passenger.pickupDetails') }}</h3>
              <p class="address">{{ ride.pickup.address }}</p>
              <p class="datetime">{{ formatDate(ride.date) }}, {{ ride.time }}</p>
            </div>
          </div>

          <div class="route-line"></div>

          <div class="location-point destination">
            <div class="location-icon">
              <i class="fas fa-map-marker-alt" />
            </div>
            <div class="location-details">
              <h3>{{ $t('passenger.destinationDetails') }}</h3>
              <p class="address">{{ ride.destination.address }}</p>
            </div>
          </div>
        </div>

        <div class="ride-map">
          <div class="map-placeholder">
            <i class="fas fa-map-marked-alt" />
            <p>{{ $t('booking.mapPlaceholder') }}</p>
          </div>
        </div>
      </div>

      <div class="ride-details-grid">
        <div class="detail-card driver-card" v-if="ride.driver">
          <h3 class="card-title">
            <i class="fas fa-user" />
            {{ $t('passenger.driver') }}
          </h3>
          <div class="driver-info">
            <div class="driver-avatar">
              <div class="avatar-placeholder">
                {{ ride.driver.initials }}
              </div>
            </div>
            <div class="driver-details">
              <p class="driver-name">{{ ride.driver.name }}</p>
              <div class="driver-rating">
                <div class="rating-stars">
                  <i
                    v-for="star in 5"
                    :key="star"
                    class="fas fa-star"
                    :class="{ 'filled': star <= ride.driver.rating }"
                  />
                </div>
                <span class="rating-value">{{ ride.driver.rating }}</span>
              </div>
              <button
                v-if="ride.status === 'confirmed' || ride.status === 'inProgress'"
                class="contact-driver-btn"
                @click="contactDriver"
              >
                <i class="fas fa-phone" />
                {{ $t('passenger.contactDriver') }}
              </button>
            </div>
          </div>
        </div>

        <div class="detail-card vehicle-card">
          <h3 class="card-title">
            <i class="fas fa-car" />
            {{ $t('passenger.vehicleInfo') }}
          </h3>
          <div class="vehicle-details">
            <div class="vehicle-image">
              <img :src="`/src/assets/vehicles/${ride.vehicle.type}.svg`" :alt="ride.vehicle.name">
            </div>
            <div class="vehicle-info">
              <p class="vehicle-type">{{ ride.vehicle.name }}</p>
              <p class="vehicle-specs">
                <span class="spec">
                  <i class="fas fa-user" />
                  {{ ride.vehicle.capacity }} {{ $t('booking.maxPassengers') }}
                </span>
                <span class="spec">
                  <i class="fas fa-suitcase" />
                  {{ ride.vehicle.luggage }} {{ $t('booking.maxLuggage') }}
                </span>
              </p>
              <p v-if="ride.vehicle.licensePlate" class="license-plate">
                {{ ride.vehicle.licensePlate }}
              </p>
            </div>
          </div>
        </div>

        <div class="detail-card payment-card">
          <h3 class="card-title">
            <i class="fas fa-credit-card" />
            {{ $t('common.payment') }}
          </h3>
          <div class="payment-details">
            <div class="payment-row">
              <span class="payment-label">{{ $t('passenger.baseFare') }}</span>
              <span class="payment-value">{{ formatPrice(ride.price) }}</span>
            </div>
            <div v-if="ride.extras && ride.extras.length > 0" class="extras-list">
              <div
                v-for="(extra, index) in ride.extras"
                :key="index"
                class="payment-row"
              >
                <span class="payment-label">{{ extra.name }}</span>
                <span class="payment-value">{{ formatPrice(extra.price) }}</span>
              </div>
            </div>
            <div class="payment-row total">
              <span class="payment-label">{{ $t('passenger.totalAmount') }}</span>
              <span class="payment-value">{{ formatPrice(getTotalPrice()) }}</span>
            </div>
            <div class="payment-method">
              <span class="method-label">{{ $t('passenger.paymentMethod') }}:</span>
              <span class="method-value">
                <i :class="getPaymentIcon(ride.paymentMethod)" />
                {{ $t(`passenger.${ride.paymentMethod}`) }}
              </span>
            </div>
          </div>
        </div>

        <div class="detail-card passenger-card">
          <h3 class="card-title">
            <i class="fas fa-info-circle" />
            {{ $t('common.details') }}
          </h3>
          <div class="passenger-details">
            <div class="detail-row">
              <span class="detail-label">{{ $t('common.passengers') }}</span>
              <span class="detail-value">{{ ride.passengers }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ $t('common.luggage') }}</span>
              <span class="detail-value">{{ ride.luggage }}</span>
            </div>
            <div v-if="ride.notes" class="detail-row notes">
              <span class="detail-label">{{ $t('booking.notes') }}</span>
              <span class="detail-value">{{ ride.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="ride-actions">
        <button
          v-if="ride.status === 'confirmed'"
          class="cancel-button"
          @click="cancelRide"
        >
          {{ $t('passenger.cancel') }}
        </button>
        <button
          v-if="ride.status === 'completed' && !ride.userRating"
          class="rate-button"
          @click="rateRide"
        >
          {{ $t('passenger.rateRide') }}
        </button>
        <button
          v-if="ride.status === 'completed'"
          class="rebook-button"
          @click="rebookRide"
        >
          {{ $t('passenger.bookSimilar') }}
        </button>
        <button
          class="support-button"
          @click="contactSupport"
        >
          {{ $t('passenger.contactSupport') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const loading = ref(true)
const ride = ref(null)

// Mock data for driver and vehicle details
const mockRideData = {
  1: {
    id: 1,
    date: '2025-04-20',
    time: '14:30',
    pickup: {
      address: 'JFK Airport, New York',
      lat: 40.6413,
      lng: -73.7781
    },
    destination: {
      address: 'Times Square, New York',
      lat: 40.7580,
      lng: -73.9855
    },
    vehicle: {
      type: 'comfort',
      name: 'Comfort',
      capacity: 4,
      luggage: 3,
      licensePlate: 'NY 123-456'
    },
    driver: {
      id: 101,
      name: 'Michael Johnson',
      initials: 'MJ',
      rating: 4.8,
      phone: '+1 555-123-4567'
    },
    price: 75.50,
    status: 'confirmed',
    passengers: 2,
    luggage: 2,
    notes: 'Please wait at the terminal 4 pickup point.',
    paymentMethod: 'creditCard',
    extras: [
      { name: 'Meet & Greet', price: 15.00 },
      { name: 'Child Seat', price: 10.00 }
    ],
    userRating: null
  },
  2: {
    id: 2,
    date: '2025-04-25',
    time: '09:15',
    pickup: {
      address: 'Central Park, New York',
      lat: 40.7812,
      lng: -73.9665
    },
    destination: {
      address: 'LaGuardia Airport, New York',
      lat: 40.7769,
      lng: -73.8740
    },
    vehicle: {
      type: 'business',
      name: 'Business',
      capacity: 4,
      luggage: 3,
      licensePlate: 'NY 789-012'
    },
    driver: {
      id: 102,
      name: 'Sarah Wilson',
      initials: 'SW',
      rating: 4.9,
      phone: '+1 555-987-6543'
    },
    price: 95.00,
    status: 'confirmed',
    passengers: 3,
    luggage: 3,
    notes: '',
    paymentMethod: 'paypal',
    extras: [],
    userRating: null
  },
  101: {
    id: 101,
    date: '2025-03-10',
    time: '11:00',
    pickup: {
      address: 'Grand Central Terminal, New York',
      lat: 40.7527,
      lng: -73.9772
    },
    destination: {
      address: 'Brooklyn Bridge, New York',
      lat: 40.7061,
      lng: -73.9969
    },
    vehicle: {
      type: 'economy',
      name: 'Economy',
      capacity: 4,
      luggage: 2,
      licensePlate: 'NY 345-678'
    },
    driver: {
      id: 103,
      name: 'Robert Davis',
      initials: 'RD',
      rating: 4.7,
      phone: '+1 555-765-4321'
    },
    price: 45.80,
    status: 'completed',
    passengers: 1,
    luggage: 1,
    notes: '',
    paymentMethod: 'cash',
    extras: [],
    userRating: 5
  }
}

// Get total price including extras
function getTotalPrice() {
  if (!ride.value) return 0

  let total = ride.value.price
  if (ride.value.extras) {
    for (const extra of ride.value.extras) {
      total += extra.price
    }
  }
  return total
}

// Format price for display
function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get payment method icon
function getPaymentIcon(method) {
  switch (method) {
    case 'creditCard':
      return 'fas fa-credit-card'
    case 'paypal':
      return 'fab fa-paypal'
    case 'cash':
      return 'fas fa-money-bill-wave'
    default:
      return 'fas fa-credit-card'
  }
}

// Navigation functions
function goBack() {
  router.back()
}

// Actions
function cancelRide() {
  // In a real app, this would call an API
  if (window.confirm(t('passenger.confirmCancel'))) {
    alert(t('passenger.rideCancelled'))
    // Update the ride status (in a real app, this would be handled by the API)
    if (ride.value) {
      ride.value.status = 'cancelled'
    }
  }
}

function contactDriver() {
  if (ride.value && ride.value.driver) {
    alert(`${t('passenger.callingDriver')}: ${ride.value.driver.phone}`)
  }
}

function rateRide() {
  // In a real app, this would open a rating modal
  const rating = prompt(t('passenger.enterRating'), '5')
  if (rating && !isNaN(Number(rating)) && Number(rating) >= 1 && Number(rating) <= 5) {
    if (ride.value) {
      ride.value.userRating = Number(rating)
      alert(t('passenger.thankYouRating'))
    }
  } else if (rating !== null) {
    alert(t('errors.invalidRating'))
  }
}

function rebookRide() {
  if (ride.value) {
    router.push({
      path: '/transfer/new',
      query: {
        pickup: ride.value.pickup.address,
        destination: ride.value.destination.address,
        vehicle: ride.value.vehicle.type,
        passengers: ride.value.passengers,
        luggage: ride.value.luggage
      }
    })
  }
}

function contactSupport() {
  alert(t('passenger.supportContactInfo'))
}

// Load ride data
onMounted(async () => {
  const rideId = parseInt(route.params.id as string, 10)

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, this would be an API call to fetch the ride details
    if (mockRideData[rideId]) {
      ride.value = mockRideData[rideId]
    }
  } catch (error) {
    console.error('Error fetching ride details:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ride-details-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #f86906;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 1rem;
}

.back-button i {
  margin-right: 0.25rem;
}

.page-header h1 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-state i,
.error-state i {
  font-size: 2.5rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.error-state .back-link {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f86906;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.ride-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.ride-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
}

.ride-status.confirmed {
  background-color: #e3f2fd;
  color: #2196f3;
}

.ride-status.completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.ride-status.cancelled {
  background-color: #ffebee;
  color: #f44336;
}

.ride-status.inProgress {
  background-color: #fff8e1;
  color: #ffa000;
}

.ride-id {
  font-size: 0.9rem;
  color: #666;
}

.ride-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.pickup-destination {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  position: relative;
}

.location-point {
  display: flex;
  margin-bottom: 1.5rem;
}

.location-point:last-child {
  margin-bottom: 0;
}

.location-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.location-point.pickup .location-icon {
  color: #f86906;
}

.location-point.destination .location-icon {
  color: #25b847;
}

.location-details h3 {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.25rem;
  font-weight: 500;
}

.address {
  font-weight: 500;
  color: #333;
  margin: 0 0 0.25rem;
}

.datetime {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.route-line {
  position: absolute;
  top: 80px;
  left: 20px;
  bottom: 80px;
  width: 1px;
  background-color: #e0e0e0;
}

.ride-map {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.map-placeholder {
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.map-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.ride-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
  margin: 0 0 1rem;
}

.card-title i {
  margin-right: 0.5rem;
  color: #f86906;
}

.driver-info {
  display: flex;
}

.driver-avatar {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f86906;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.driver-name {
  font-weight: 500;
  color: #333;
  margin: 0 0 0.25rem;
}

.driver-rating {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
  color: #ccc;
  margin-right: 0.5rem;
}

.rating-stars .filled {
  color: #ffc107;
}

.rating-value {
  font-weight: 500;
  color: #333;
}

.contact-driver-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.vehicle-details {
  display: flex;
}

.vehicle-image {
  width: 80px;
  height: 80px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vehicle-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.vehicle-type {
  font-weight: 500;
  color: #333;
  margin: 0 0 0.25rem;
}

.vehicle-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.spec {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.spec i {
  margin-right: 0.25rem;
}

.license-plate {
  font-weight: 500;
  color: #333;
  margin: 0.5rem 0 0;
  padding: 0.25rem 0.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: inline-block;
}

.payment-details {
  display: flex;
  flex-direction: column;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.payment-row.total {
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 1.1rem;
}

.payment-method {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.method-label {
  color: #666;
}

.method-value {
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.passenger-details {
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.detail-row.notes {
  flex-direction: column;
}

.detail-row.notes .detail-label {
  margin-bottom: 0.25rem;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: 500;
  color: #333;
}

.ride-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button,
.rate-button,
.rebook-button,
.support-button {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.rate-button {
  background-color: #ffc107;
  color: #333;
}

.rebook-button {
  background-color: #25b847;
  color: white;
}

.support-button {
  background-color: #f0f0f0;
  color: #333;
}

@media (max-width: 992px) {
  .ride-overview {
    grid-template-columns: 1fr;
  }

  .ride-details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .ride-status-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .ride-actions {
    flex-direction: column;
  }

  .cancel-button,
  .rate-button,
  .rebook-button,
  .support-button {
    width: 100%;
  }
}
</style>
