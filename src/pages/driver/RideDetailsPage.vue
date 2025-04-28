<template>
  <div class="ride-details-page">
    <div class="page-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        {{ $t('common.back') }}
      </button>
      <h1>{{ $t('driver.rideDetails') }}</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!ride" class="error-state">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <p>{{ $t('errors.rideNotFound') }}</p>
      <button class="back-btn" @click="goBack">{{ $t('common.back') }}</button>
    </div>

    <div v-else class="ride-content">
      <div class="ride-status-card">
        <div class="status-header">
          <h2>{{ $t('passenger.status') }}</h2>
          <div class="status-badge" :class="ride.status">
            {{ $t(`passenger.${ride.status}`) }}
          </div>
        </div>

        <div class="status-actions">
          <button
            v-if="ride.status === 'confirmed'"
            class="action-btn start-btn"
            @click="startRide"
          >
            <i class="fas fa-play"></i>
            {{ $t('driver.startRide') }}
          </button>
          <button
            v-if="ride.status === 'inProgress'"
            class="action-btn complete-btn"
            @click="completeRide"
          >
            <i class="fas fa-check"></i>
            {{ $t('driver.completeRide') }}
          </button>
          <button
            v-if="['confirmed', 'inProgress'].includes(ride.status)"
            class="action-btn cancel-btn"
            @click="showCancelModal = true"
          >
            <i class="fas fa-times"></i>
            {{ $t('driver.cancelRide') }}
          </button>
          <a
            v-if="ride.passenger && ride.passenger.phone"
            :href="`tel:${ride.passenger.phone}`"
            class="action-btn call-btn"
          >
            <i class="fas fa-phone"></i>
            {{ $t('common.call') }}
          </a>
        </div>
      </div>

      <div class="ride-map-card">
        <h2>{{ $t('driver.route') }}</h2>
        <div class="map-container">
          <div class="map-placeholder">
            <i class="fas fa-map-marked-alt"></i>
            <p>{{ $t('driver.mapPlaceholder') }}</p>
          </div>
        </div>
      </div>

      <div class="ride-details-card">
        <h2>{{ $t('driver.rideDetails') }}</h2>

        <div class="detail-section">
          <div class="detail-row">
            <div class="detail-label">{{ $t('common.date') }}</div>
            <div class="detail-value">{{ formatDate(ride.date) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('common.time') }}</div>
            <div class="detail-value">{{ ride.time }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('common.vehicleType') }}</div>
            <div class="detail-value vehicle-type">
              <i :class="getVehicleIcon(ride.vehicleType)"></i>
              {{ $t(`booking.${ride.vehicleType}`) }}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('passenger.totalAmount') }}</div>
            <div class="detail-value price">${{ ride.price.toFixed(2) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('driver.yourEarnings') }}</div>
            <div class="detail-value earnings">${{ (ride.price * 0.8).toFixed(2) }}</div>
          </div>
        </div>

        <h3>{{ $t('driver.pickupDetails') }}</h3>
        <div class="location-section">
          <div class="location-icon pickup-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="location-details">
            <div class="location-address">{{ ride.pickup.address }}</div>
            <button class="location-action" @click="getDirections(ride.pickup.address)">
              <i class="fas fa-directions"></i>
              {{ $t('driver.getDirections') }}
            </button>
          </div>
        </div>

        <h3>{{ $t('driver.destinationDetails') }}</h3>
        <div class="location-section">
          <div class="location-icon destination-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="location-details">
            <div class="location-address">{{ ride.destination.address }}</div>
            <button class="location-action" @click="getDirections(ride.destination.address)">
              <i class="fas fa-directions"></i>
              {{ $t('driver.getDirections') }}
            </button>
          </div>
        </div>
      </div>

      <div class="passenger-details-card">
        <h2>{{ $t('driver.passengerDetails') }}</h2>
        <div class="passenger-info">
          <div class="passenger-avatar">
            <div class="avatar-placeholder">
              {{ getInitials(ride.passenger.name) }}
            </div>
          </div>
          <div class="passenger-data">
            <div class="passenger-name">{{ ride.passenger.name }}</div>
            <div class="passenger-contact">
              <a :href="`tel:${ride.passenger.phone}`" class="phone-link">
                <i class="fas fa-phone"></i>
                {{ ride.passenger.phone }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="ride.notes" class="passenger-notes">
          <h3>{{ $t('driver.passengerNotes') }}</h3>
          <div class="notes-content">{{ ride.notes }}</div>
        </div>
      </div>

      <div v-if="ride.status === 'completed'" class="rating-card">
        <h2>{{ $t('driver.rating') }}</h2>
        <div v-if="ride.rating" class="rating-display">
          <div class="rating-stars">
            <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= ride.rating }"></i>
          </div>
          <div class="rating-value">{{ ride.rating }}/5</div>
        </div>
        <div v-else class="no-rating">
          {{ $t('driver.noRatingYet') }}
        </div>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div v-if="showCancelModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('driver.cancelRideConfirm') }}</h3>
          <button class="modal-close" @click="showCancelModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ $t('driver.cancelRideWarning') }}</p>
          <div class="form-group">
            <label for="cancel-reason">{{ $t('driver.cancelReason') }}</label>
            <select id="cancel-reason" v-model="cancelReason">
              <option value="">{{ $t('driver.selectReason') }}</option>
              <option value="vehicle_issues">{{ $t('driver.vehicleIssues') }}</option>
              <option value="traffic">{{ $t('driver.heavyTraffic') }}</option>
              <option value="emergency">{{ $t('driver.personalEmergency') }}</option>
              <option value="other">{{ $t('driver.otherReason') }}</option>
            </select>
          </div>
          <div v-if="cancelReason === 'other'" class="form-group">
            <label for="cancel-notes">{{ $t('driver.cancelNotes') }}</label>
            <textarea id="cancel-notes" v-model="cancelNotes" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showCancelModal = false">
            {{ $t('common.back') }}
          </button>
          <button
            class="primary-btn danger-btn"
            :disabled="!cancelReason"
            @click="cancelRide"
          >
            {{ $t('driver.confirmCancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// State
const loading = ref(true)
const ride = ref(null)
const showCancelModal = ref(false)
const cancelReason = ref('')
const cancelNotes = ref('')

// Get the ride ID from the route params
const rideId = parseInt(route.params.id as string)

// Fetch ride data
onMounted(async () => {
  try {
    // Simulate API call to fetch ride details
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock data - in a real app this would come from the API
    const mockRides = [
      {
        id: 1,
        date: '2025-04-20',
        time: '14:30',
        pickup: { address: 'JFK Airport, New York' },
        destination: { address: 'Times Square, New York' },
        passenger: { name: 'John Smith', phone: '+1 555-123-4567' },
        vehicleType: 'comfort',
        price: 75.50,
        distance: 28,
        status: 'confirmed'
      },
      {
        id: 2,
        date: '2025-04-21',
        time: '09:15',
        pickup: { address: 'Central Park, New York' },
        destination: { address: 'LaGuardia Airport, New York' },
        passenger: { name: 'Emily Johnson', phone: '+1 555-987-6543' },
        vehicleType: 'business',
        price: 95.00,
        distance: 24,
        status: 'confirmed'
      },
      {
        id: 3,
        date: '2025-04-22',
        time: '18:45',
        pickup: { address: 'Brooklyn Bridge, New York' },
        destination: { address: 'Statue of Liberty Ferry, New York' },
        passenger: { name: 'Michael Brown', phone: '+1 555-456-7890' },
        vehicleType: 'suv',
        price: 120.00,
        distance: 15,
        status: 'inProgress',
        notes: 'Please call me when you arrive at pickup. I have a lot of luggage.'
      },
      {
        id: 101,
        date: '2025-04-15',
        time: '10:00',
        pickup: { address: 'Grand Central Station, New York' },
        destination: { address: 'Wall Street, New York' },
        passenger: { name: 'Sarah Williams', phone: '+1 555-222-3333' },
        vehicleType: 'business',
        price: 65.75,
        distance: 18,
        status: 'completed',
        rating: 5
      }
    ]

    // Find the ride with the matching ID
    const foundRide = mockRides.find(r => r.id === rideId)
    ride.value = foundRide || null
  } catch (error) {
    console.error('Error fetching ride details:', error)
  } finally {
    loading.value = false
  }
})

// Methods
function goBack() {
  router.push('/driver/rides')
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function getVehicleIcon(vehicleType) {
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

function getInitials(name) {
  if (!name) return ''

  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0)

  return names[0].charAt(0) + names[names.length - 1].charAt(0)
}

function startRide() {
  if (ride.value) {
    ride.value.status = 'inProgress'
    // In a real app, this would make an API call to update the ride status
    alert(t('driver.rideStarted'))
  }
}

function completeRide() {
  if (ride.value) {
    ride.value.status = 'completed'
    // In a real app, this would make an API call to update the ride status
    alert(t('driver.rideCompleted'))
  }
}

function cancelRide() {
  if (ride.value) {
    ride.value.status = 'cancelled'
    ride.value.cancelReason = cancelReason.value
    ride.value.cancelNotes = cancelNotes.value

    // In a real app, this would make an API call to update the ride status
    showCancelModal.value = false
    alert(t('driver.rideCancelled'))
  }
}

function getDirections(address) {
  // In a real app, this would open directions in a map app or show directions on the map
  const encodedAddress = encodeURIComponent(address)
  window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank')
}
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
  color: #0366d6;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-right: 1rem;
}

.back-button i {
  margin-right: 0.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0366d6;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  color: #e53935;
  margin-bottom: 1rem;
}

.error-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.back-btn {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #333;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #e8e8e8;
}

.ride-content {
  display: grid;
  gap: 1.5rem;
}

.ride-status-card,
.ride-map-card,
.ride-details-card,
.passenger-details-card,
.rating-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.status-header h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.confirmed {
  background-color: #e3f7eb;
  color: #25b847;
}

.status-badge.inProgress {
  background-color: #fff5e6;
  color: #f5a623;
}

.status-badge.completed {
  background-color: #e6f2ff;
  color: #0366d6;
}

.status-badge.cancelled {
  background-color: #ffebee;
  color: #e53935;
}

.status-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-btn i {
  margin-right: 0.5rem;
}

.start-btn {
  background-color: #25b847;
  color: white;
  border: none;
}

.start-btn:hover {
  background-color: #1e9e3e;
}

.complete-btn {
  background-color: #0366d6;
  color: white;
  border: none;
}

.complete-btn:hover {
  background-color: #0255b3;
}

.cancel-btn {
  background-color: white;
  color: #e53935;
  border: 1px solid #e53935;
}

.cancel-btn:hover {
  background-color: #ffebee;
}

.call-btn {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.call-btn:hover {
  background-color: #f5f5f5;
}

.ride-map-card h2,
.ride-details-card h2,
.passenger-details-card h2,
.rating-card h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 1.25rem;
}

.map-container {
  height: 300px;
  border-radius: 4px;
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

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: 500;
  color: #333;
}

.vehicle-type {
  display: flex;
  align-items: center;
}

.vehicle-type i {
  margin-right: 0.5rem;
}

.price {
  color: #0366d6;
}

.earnings {
  color: #25b847;
}

.ride-details-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 1.25rem 0 0.75rem;
}

.location-section {
  display: flex;
  margin-bottom: 1rem;
}

.location-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.location-icon.pickup-icon {
  background-color: #fff5ed;
  color: #f86906;
}

.location-icon.destination-icon {
  background-color: #e3f7eb;
  color: #25b847;
}

.location-details {
  flex: 1;
}

.location-address {
  margin-bottom: 0.5rem;
}

.location-action {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #0366d6;
  font-size: 0.9rem;
  padding: 0;
  cursor: pointer;
}

.location-action i {
  margin-right: 0.25rem;
}

.passenger-info {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.passenger-avatar {
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e6f2ff;
  color: #0366d6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 500;
}

.passenger-data {
  flex: 1;
}

.passenger-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.passenger-contact {
  color: #666;
}

.phone-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.phone-link i {
  margin-right: 0.5rem;
  color: #0366d6;
}

.passenger-notes {
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.passenger-notes h3 {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.75rem;
}

.notes-content {
  color: #666;
  line-height: 1.5;
}

.rating-display {
  display: flex;
  align-items: center;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
  margin-right: 0.75rem;
}

.rating-stars .fa-star {
  color: #ddd;
}

.rating-stars .filled {
  color: #f5a623;
}

.rating-value {
  font-weight: 500;
  color: #333;
}

.no-rating {
  color: #666;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1.25rem;
  color: #666;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.secondary-btn,
.primary-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.secondary-btn:hover {
  background-color: #f5f5f5;
}

.primary-btn {
  background-color: #0366d6;
  color: white;
  border: none;
}

.primary-btn:hover {
  background-color: #0255b3;
}

.danger-btn {
  background-color: #e53935;
}

.danger-btn:hover {
  background-color: #d32f2f;
}

.primary-btn:disabled {
  background-color: #a5c8ef;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .status-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .detail-row {
    flex-direction: column;
  }

  .detail-label {
    margin-bottom: 0.25rem;
  }

  .passenger-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .passenger-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
