<template>
  <div class="booking-page">
    <div class="container">
      <div class="booking-header">
        <h1>{{ $t('booking.title') }}</h1>
        <p class="booking-subtitle">{{ $t('booking.subtitle') }}</p>
      </div>

      <div class="booking-grid">
        <div class="booking-form-container">
          <!-- Booking form -->
          <div class="booking-form">
            <h2>{{ $t('booking.details') }}</h2>

            <div class="form-group">
              <label for="pickup">{{ $t('common.from') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-start"></i>
                <input
                  id="pickup"
                  v-model="bookingStore.pickup.address"
                  type="text"
                  :placeholder="$t('common.from')"
                  @focus="onPickupFocus"
                  @input="searchPickupLocations"
                >
                <!-- Location detection button -->
                <button
                  v-if="locationDetected"
                  class="use-location-btn"
                  @click="useCurrentLocation"
                  type="button"
                  :title="$t('booking.useCurrentLocation')"
                >
                  <i class="fas fa-crosshairs"></i>
                </button>
                <!-- Location detection status indicator -->
                <span
                  v-else-if="locationStatus"
                  class="location-status"
                  :class="locationStatus"
                >
                  <i
                    class="fas"
                    :class="{
                      'fa-spinner fa-spin': locationStatus === 'loading',
                      'fa-map-marker-alt': locationStatus === 'detected',
                      'fa-exclamation-circle': locationStatus === 'error'
                    }"
                  ></i>
                </span>
              </div>

              <!-- Pickup location suggestions with nearby info -->
              <div class="location-suggestions" v-if="showPickupSuggestions && pickupSuggestions.length > 0">
                <div class="suggestion-heading" v-if="locationDetected">
                  {{ $t('booking.nearbyLocations') }}
                </div>
                <div
                  v-for="suggestion in pickupSuggestions"
                  :key="suggestion.id"
                  class="suggestion-item"
                  @click="selectPickupLocation(suggestion)"
                >
                  <div class="suggestion-text">{{ suggestion.text }}</div>
                  <div class="suggestion-description">{{ suggestion.description }}</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="destination">{{ $t('common.to') }}</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt icon-end"></i>
                <input
                  id="destination"
                  v-model="bookingStore.destination.address"
                  type="text"
                  :placeholder="$t('common.to')"
                  @focus="onDestinationFocus"
                  @input="searchDestinationLocations"
                >
              </div>

              <!-- Destination location suggestions -->
              <div class="location-suggestions" v-if="showDestinationSuggestions && destinationSuggestions.length > 0">
                <div class="suggestion-heading" v-if="locationDetected && (!bookingStore.destination.address || bookingStore.destination.address.length < 2)">
                  {{ $t('booking.recommendedDestinations') }}
                </div>
                <div
                  v-for="suggestion in destinationSuggestions"
                  :key="suggestion.id"
                  class="suggestion-item"
                  @click="selectDestinationLocation(suggestion)"
                >
                  <div class="suggestion-text">{{ suggestion.text }}</div>
                  <div class="suggestion-description">{{ suggestion.description }}</div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="date">{{ $t('common.date') }}</label>
                <div class="input-with-icon">
                  <i class="fas fa-calendar"></i>
                  <input
                    id="date"
                    v-model="bookingStore.date"
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
                    v-model="bookingStore.time"
                    type="time"
                  >
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="passengers">{{ $t('booking.passengers') }}</label>
                <div class="number-input">
                  <button class="number-btn" @click="decrementPassengers">-</button>
                  <input
                    id="passengers"
                    v-model.number="bookingStore.passengers"
                    type="number"
                    min="1"
                    max="99"
                  >
                  <button class="number-btn" @click="incrementPassengers">+</button>
                </div>
              </div>

              <div class="form-group">
                <label for="luggage">{{ $t('booking.luggage') }}</label>
                <div class="number-input">
                  <button class="number-btn" @click="decrementLuggage">-</button>
                  <input
                    id="luggage"
                    v-model.number="bookingStore.luggage"
                    type="number"
                    min="0"
                    max="99"
                  >
                  <button class="number-btn" @click="incrementLuggage">+</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="notes">{{ $t('booking.notes') }}</label>
              <textarea
                id="notes"
                v-model="bookingStore.notes"
                :placeholder="$t('booking.notesPlaceholder')"
              ></textarea>
            </div>
          </div>

          <!-- Route Map -->
          <RouteMap />
        </div>

        <div class="booking-summary">
          <div class="summary-header">
            <h2>{{ $t('booking.summary') }}</h2>
          </div>

          <div class="summary-details">
            <div class="summary-row">
              <span class="summary-label">{{ $t('common.from') }}</span>
              <span class="summary-value">{{ bookingStore.pickup.address || $t('booking.notSelected') }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('common.to') }}</span>
              <span class="summary-value">{{ bookingStore.destination.address || $t('booking.notSelected') }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('common.date') }}</span>
              <span class="summary-value">{{ formatDate(bookingStore.date) }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('common.time') }}</span>
              <span class="summary-value">{{ formatTime(bookingStore.time) }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('booking.vehicle') }}</span>
              <span class="summary-value">{{ vehicleName }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('booking.passengers') }}</span>
              <span class="summary-value">{{ bookingStore.passengers }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('booking.luggage') }}</span>
              <span class="summary-value">{{ bookingStore.luggage }}</span>
            </div>

            <div class="summary-row" v-if="bookingStore.routeDistance > 0">
              <span class="summary-label">{{ $t('booking.distance') }}</span>
              <span class="summary-value">{{ bookingStore.routeDistance.toFixed(1) }} km</span>
            </div>

            <div class="summary-row" v-if="bookingStore.routeDuration > 0">
              <span class="summary-label">{{ $t('booking.duration') }}</span>
              <span class="summary-value">{{ formatDuration(bookingStore.routeDuration) }}</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">{{ $t('booking.price') }}</span>
              <span class="summary-value total-price">${{ bookingStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <div class="summary-actions">
            <button
              class="book-btn"
              :disabled="!bookingStore.bookingDetailsValid || bookingStore.loading"
              @click="createBooking"
            >
              {{ bookingStore.loading ? $t('common.processing') : $t('booking.bookNow') }}
            </button>
          </div>
        </div>
      </div>

      <div class="vehicle-selection">
        <h2>{{ $t('booking.selectVehicle') }}</h2>

        <div class="vehicles-list">
          <div
            v-for="vehicle in bookingStore.availableVehicles"
            :key="vehicle.id"
            class="vehicle-card"
            :class="{ 'selected': bookingStore.selectedVehicle === vehicle.id }"
            @click="bookingStore.setVehicle(vehicle.id)"
          >
            <div class="vehicle-image">
              <img :src="`../assets/vehicles/${vehicle.type}.svg`" :alt="vehicle.name">
            </div>

            <div class="vehicle-details">
              <h3>{{ vehicle.name }}</h3>

              <div class="vehicle-specs">
                <div class="spec">
                  <i class="fas fa-user"></i>
                  {{ vehicle.capacity }} {{ $t('booking.peopleMax') }}
                </div>

                <div class="spec">
                  <i class="fas fa-suitcase"></i>
                  {{ vehicle.luggage }} {{ $t('booking.luggageMax') }}
                </div>
              </div>

              <div class="vehicle-price">${{ calculateVehiclePrice(vehicle).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBookingStore } from '../stores/useBookingStore'
import locationService from '../services/location.service'
import RouteMap from '../components/RouteMap.vue'

// Initialize i18n
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

// Location suggestions state
const pickupSuggestions = ref<any[]>([])
const destinationSuggestions = ref<any[]>([])
const showPickupSuggestions = ref(false)
const showDestinationSuggestions = ref(false)
const locationDetected = ref(false)
const locationStatus = ref<'loading' | 'detected' | 'error' | ''>('')

// Search debounce timers
let pickupSearchTimer: number | null = null
let destinationSearchTimer: number | null = null

// Computed properties
const vehicleName = computed(() => {
  return bookingStore.currentVehicle?.name || t('booking.economy')
})

// Methods
function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(dateStr: string) {
  if (!dateStr) return t('booking.notSelected')
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch (e) {
    return dateStr
  }
}

function formatTime(timeStr: string) {
  if (!timeStr) return t('booking.notSelected')
  return timeStr
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

function calculateVehiclePrice(vehicle: any) {
  if (!vehicle) return 0

  let price = vehicle.price

  // If we have distance information, calculate based on distance
  if (bookingStore.routeDistance > 0 && bookingStore.bookingType === 'ride') {
    // Adding distance-based calculation (price per km)
    const pricePerKm = vehicle.price / 10 // This is a simplified formula
    price = Math.round(pricePerKm * bookingStore.routeDistance)

    // Ensure minimum price
    price = Math.max(price, vehicle.price)
  }

  return price
}

// Location search functions
async function searchPickupLocations() {
  // Clear previous timer
  if (pickupSearchTimer) {
    clearTimeout(pickupSearchTimer)
  }

  // Debounce search
  pickupSearchTimer = setTimeout(async () => {
    try {
      const query = bookingStore.pickup.address || '';

      // Always show suggestions, even for empty query
      const suggestions = await locationService.searchLocationSuggestions(query);
      pickupSuggestions.value = suggestions;

      // Add distance information if available
      if (locationService.userLocation.detected) {
        pickupSuggestions.value = pickupSuggestions.value.map(suggestion => {
          if (suggestion.distance) {
            return {
              ...suggestion,
              description: `${suggestion.description} (${suggestion.distance} km away)`
            }
          }
          return suggestion
        })
      }
    } catch (error) {
      console.error('Error searching pickup locations:', error)
      pickupSuggestions.value = []
    }
  }, 300) as unknown as number
}

async function searchDestinationLocations() {
  // Clear previous timer
  if (destinationSearchTimer) {
    clearTimeout(destinationSearchTimer)
  }

  // Debounce search
  destinationSearchTimer = setTimeout(async () => {
    try {
      const query = bookingStore.destination.address || ''

      // Always get suggestions, even for empty query
      const suggestions = await locationService.searchLocationSuggestions(query)

      // If we have a pickup location with coordinates, prioritize destinations that make sense
      if (bookingStore.pickup.lat && bookingStore.pickup.lng && locationService.userLocation.detected) {
        // Sort by relevance to current pickup location
        destinationSuggestions.value = suggestions.sort((a, b) => {
          // If we have no query or very short query, prioritize popular places
          if (!query || query.length < 2) {
            // This would weight the sorting toward popular destinations
            const aPopular = a.description.toLowerCase().includes('airport') ? -2 :
                            a.description.toLowerCase().includes('station') ? -1 : 0
            const bPopular = b.description.toLowerCase().includes('airport') ? -2 :
                            b.description.toLowerCase().includes('station') ? -1 : 0
            return aPopular - bPopular
          }
          return 0
        })
      } else {
        destinationSuggestions.value = suggestions
      }
    } catch (error) {
      console.error('Error searching destination locations:', error)
      destinationSuggestions.value = []
    }
  }, 300) as unknown as number
}

// Handle selecting a location from suggestions
function selectPickupLocation(suggestion: any) {
  bookingStore.setPickup(suggestion.text)

  if (suggestion.lat && suggestion.lng) {
    bookingStore.setPickupCoordinates(suggestion.lat, suggestion.lng)
  }

  showPickupSuggestions.value = false
  pickupSuggestions.value = []
}

function selectDestinationLocation(suggestion: any) {
  bookingStore.setDestination(suggestion.text)

  if (suggestion.lat && suggestion.lng) {
    bookingStore.setDestinationCoordinates(suggestion.lat, suggestion.lng)
  }

  showDestinationSuggestions.value = false
  destinationSuggestions.value = []
}

// Click outside to close suggestions
function setupClickOutsideListener() {
  document.addEventListener('click', (e: MouseEvent) => {
    // Close pickup suggestions if click outside
    if (showPickupSuggestions.value && !(e.target as Element).closest('#pickup')) {
      showPickupSuggestions.value = false
    }

    // Close destination suggestions if click outside
    if (showDestinationSuggestions.value && !(e.target as Element).closest('#destination')) {
      showDestinationSuggestions.value = false
    }
  })
}

// Form controls
function incrementPassengers() {
  if (bookingStore.passengers < 99) {
    bookingStore.setPassengers(bookingStore.passengers + 1)
  }
}

function decrementPassengers() {
  if (bookingStore.passengers > 1) {
    bookingStore.setPassengers(bookingStore.passengers - 1)
  }
}

function incrementLuggage() {
  if (bookingStore.luggage < 99) {
    bookingStore.setLuggage(bookingStore.luggage + 1)
  }
}

function decrementLuggage() {
  if (bookingStore.luggage > 0) {
    bookingStore.setLuggage(bookingStore.luggage - 1)
  }
}

// Use current location for pickup
async function useCurrentLocation() {
  try {
    // Try to detect user's location
    locationStatus.value = 'loading'
    const userLocation = await locationService.detectUserLocation()

    if (userLocation.detected && userLocation.lat && userLocation.lng) {
      // Set pickup coordinates
      bookingStore.setPickupCoordinates(userLocation.lat, userLocation.lng)

      // Get address for the coordinates
      const location = await locationService.reverseGeocode(userLocation.lat, userLocation.lng)
      if (location) {
        bookingStore.setPickup(location.address)
      }

      locationStatus.value = 'detected'

      // After setting pickup, search for destinations near this location
      showDestinationSuggestions.value = true
      await searchDestinationLocations()
    } else {
      locationStatus.value = 'error'
    }
  } catch (error) {
    console.error('Error using current location:', error)
    locationStatus.value = 'error'
  }
}

// Create booking
async function createBooking() {
  try {
    const success = await bookingStore.createBooking()

    if (success) {
      // Show success message and redirect to rides
      alert(t('booking.successMessage'))
      router.push('/passenger/rides')
    } else {
      // Show error message
      alert(bookingStore.error || t('errors.generic'))
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    alert(t('errors.generic'))
  }
}

// Initialize page with query parameters if provided
function initializeFromQuery() {
  const query = route.query

  if (query.type) {
    bookingStore.setBookingType(query.type as 'ride' | 'hourly')
  }

  if (query.pickup) {
    bookingStore.setPickup(query.pickup as string)
  }

  if (query.destination) {
    bookingStore.setDestination(query.destination as string)
  }

  if (query.date) {
    bookingStore.setDate(query.date as string)
  } else {
    bookingStore.setDate(getTodayDate())
  }

  if (query.time) {
    bookingStore.setTime(query.time as string)
  } else {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    bookingStore.setTime(`${hours}:${minutes}`)
  }

  if (query.vehicle) {
    bookingStore.setVehicle(query.vehicle as string)
  }
}

// Initialize the page
onMounted(async () => {
  // Initialize data from query parameters
  initializeFromQuery()

  // Setup click outside listener
  setupClickOutsideListener()

  // Try to detect user's location
  try {
    locationStatus.value = 'loading'
    const userLocation = await locationService.detectUserLocation()

    if (userLocation.detected) {
      locationDetected.value = true
      locationStatus.value = 'detected'

      // Load nearby locations regardless of pickup field content
      showPickupSuggestions.value = true
      await searchPickupLocations()

      // Also initialize destination suggestions if destination field is empty
      if (!bookingStore.destination.address) {
        await searchDestinationLocations()
      }
    } else {
      locationStatus.value = 'error'
    }
  } catch (error) {
    console.error('Error detecting location:', error)
    locationStatus.value = 'error'
  }

  // Initialize locations if we have addresses but no coordinates
  if (bookingStore.pickup.address && (!bookingStore.pickup.lat || !bookingStore.pickup.lng)) {
    locationService.geocodeAddress(bookingStore.pickup.address).then(location => {
      if (location) {
        bookingStore.setPickupCoordinates(location.lat, location.lng)
      }
    })
  }

  if (bookingStore.destination.address && (!bookingStore.destination.lat || !bookingStore.destination.lng)) {
    locationService.geocodeAddress(bookingStore.destination.address).then(location => {
      if (location) {
        bookingStore.setDestinationCoordinates(location.lat, location.lng)
      }
    })
  }
})

// Set up a focus handler for pickup field
function onPickupFocus() {
  showPickupSuggestions.value = true

  // Always search for locations when focusing the field
  searchPickupLocations()
}

// Set up a focus handler for destination field
function onDestinationFocus() {
  showDestinationSuggestions.value = true

  // Always search for destinations when focusing the field
  searchDestinationLocations()
}
</script>

<style scoped>
.booking-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.booking-header {
  margin-bottom: 2rem;
  text-align: center;
}

.booking-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.booking-subtitle {
  color: #666;
}

.booking-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.booking-form-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 992px) {
  .booking-form-container {
    grid-template-columns: 1fr 1fr;
  }
}

.booking-form,
.vehicle-selection {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.booking-form h2,
.vehicle-selection h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
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

// Add use location button styles
.use-location-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #25b847;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s ease;
  font-size: 1rem;
  border-radius: 50%;
}

.use-location-btn:hover {
  color: #1e9e3e;
  background-color: rgba(37, 184, 71, 0.1);
}

.use-location-btn:active {
  background-color: rgba(37, 184, 71, 0.2);
}

/* Location Suggestions Dropdown */
.location-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-text {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.suggestion-description {
  font-size: 0.8rem;
  color: #999;
}

.number-input {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.number-input input {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  text-align: center;
  font-size: 1rem;
  -moz-appearance: textfield;
}

.number-input input::-webkit-outer-spin-button,
.number-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-btn {
  background-color: #f3f3f3;
  border: none;
  color: #666;
  width: 40px;
  height: 100%;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.number-btn:hover {
  background-color: #e5e5e5;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.vehicles-list {
  display: grid;
  gap: 1rem;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.vehicle-card {
  display: flex;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vehicle-card:hover {
  border-color: #f86906;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.vehicle-card.selected {
  border-color: #f86906;
  background-color: #fff5ed;
}

.vehicle-image {
  width: 80px;
  height: 80px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.vehicle-details {
  flex: 1;
}

.vehicle-details h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.vehicle-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
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

.vehicle-price {
  font-weight: 600;
  color: #333;
}

.booking-summary {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.summary-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
}

.summary-header h2 {
  font-size: 1.25rem;
  margin-bottom: 0;
  color: #333;
}

.summary-details {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.summary-label {
  color: #666;
}

.summary-value {
  font-weight: 500;
  color: #333;
}

.total-price {
  font-size: 1.25rem;
  color: #f86906;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
}

.book-btn {
  padding: 0.75rem 2rem;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.book-btn:hover {
  background-color: #1e9e3e;
}

.book-btn:disabled {
  background-color: #a6ddb6;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .booking-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .booking-form-container {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Location detection status indicator */
.location-status {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
}

.location-status.loading {
  color: #999;
}

.location-status.detected {
  color: #25b847;
}

.location-status.error {
  color: #ff4d4f;
}

/* Suggestion heading for nearby locations */
.suggestion-heading {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #666;
  font-size: 0.85rem;
}

/* Highlight distance information in suggestion */
.suggestion-description {
  font-size: 0.8rem;
  color: #999;
}

.suggestion-description strong {
  color: #666;
  font-weight: 500;
}
</style>
