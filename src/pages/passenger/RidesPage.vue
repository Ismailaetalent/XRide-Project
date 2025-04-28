<template>
  <div class="rides-page">
    <div class="page-header">
      <h1>{{ $t('passenger.rides') }}</h1>
      <router-link to="/transfer/new" class="new-booking-btn">
        <i class="fas fa-plus-circle"></i>
        {{ $t('nav.newBooking') }}
      </router-link>
    </div>

    <div class="rides-tabs">
      <button
        class="tab-button"
        :class="{ 'active': activeTab === 'upcoming' }"
        @click="activeTab = 'upcoming'"
      >
        {{ $t('passenger.upcomingRides') }}
        <span class="badge" v-if="upcomingRides.length">{{ upcomingRides.length }}</span>
      </button>
      <button
        class="tab-button"
        :class="{ 'active': activeTab === 'past' }"
        @click="activeTab = 'past'"
      >
        {{ $t('passenger.completedRides') }}
        <span class="badge" v-if="pastRides.length">{{ pastRides.length }}</span>
      </button>
    </div>

    <div class="tab-content">
      <!-- Upcoming Rides Tab -->
      <div v-if="activeTab === 'upcoming'" class="rides-list">
        <div v-if="upcomingRides.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-car"></i>
          </div>
          <p>{{ $t('passenger.noUpcomingRides') }}</p>
          <router-link to="/transfer/new" class="book-button">
            {{ $t('passenger.bookNow') }}
          </router-link>
        </div>

        <div v-else class="ride-cards">
          <div
            v-for="ride in upcomingRides"
            :key="ride.id"
            class="ride-card"
            @click="viewRideDetails(ride.id)"
          >
            <div class="ride-status" :class="ride.status">
              {{ $t(`passenger.${ride.status}`) }}
            </div>
            <div class="ride-info">
              <div class="ride-date">
                <span class="date">{{ formatDate(ride.date) }}</span>
                <span class="time">{{ ride.time }}</span>
              </div>
              <div class="ride-details">
                <div class="ride-locations">
                  <div class="pickup">
                    <i class="fas fa-map-marker-alt pickup-icon"></i>
                    <span>{{ ride.pickup.address }}</span>
                  </div>
                  <div class="destination">
                    <i class="fas fa-map-marker-alt destination-icon"></i>
                    <span>{{ ride.destination.address }}</span>
                  </div>
                </div>
                <div class="ride-vehicle">
                  <i :class="getVehicleIcon(ride.vehicle.type)"></i>
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
              <button class="contact-button" @click.stop="contactDriver(ride.id)">
                {{ $t('passenger.contactDriver') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Rides Tab -->
      <div v-if="activeTab === 'past'" class="rides-list">
        <div v-if="pastRides.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-history"></i>
          </div>
          <p>{{ $t('passenger.noCompletedRides') }}</p>
          <router-link to="/transfer/new" class="book-button">
            {{ $t('passenger.bookNow') }}
          </router-link>
        </div>

        <div v-else class="ride-cards">
          <div
            v-for="ride in pastRides"
            :key="ride.id"
            class="ride-card"
            @click="viewRideDetails(ride.id)"
          >
            <div class="ride-status" :class="ride.status">
              {{ $t(`passenger.${ride.status}`) }}
            </div>
            <div class="ride-info">
              <div class="ride-date">
                <span class="date">{{ formatDate(ride.date) }}</span>
                <span class="time">{{ ride.time }}</span>
              </div>
              <div class="ride-details">
                <div class="ride-locations">
                  <div class="pickup">
                    <i class="fas fa-map-marker-alt pickup-icon"></i>
                    <span>{{ ride.pickup.address }}</span>
                  </div>
                  <div class="destination">
                    <i class="fas fa-map-marker-alt destination-icon"></i>
                    <span>{{ ride.destination.address }}</span>
                  </div>
                </div>
                <div class="ride-vehicle">
                  <i :class="getVehicleIcon(ride.vehicle.type)"></i>
                  <span>{{ ride.vehicle.name }}</span>
                </div>
              </div>
              <div class="ride-price">
                <span>{{ formatPrice(ride.price) }}</span>
              </div>
            </div>
            <div class="ride-actions">
              <div v-if="ride.status === 'completed'" class="ride-rating">
                <div class="rating-stars">
                  <i
                    v-for="star in 5"
                    :key="star"
                    class="fas fa-star"
                    :class="{ 'filled': star <= (ride.rating || 0) }"
                  ></i>
                </div>
                <button
                  v-if="!ride.rating"
                  class="review-button"
                  @click.stop="rateRide(ride.id)"
                >
                  {{ $t('passenger.rateRide') }}
                </button>
              </div>
              <button
                v-if="ride.status === 'completed'"
                class="rebook-button"
                @click.stop="rebookRide(ride)"
              >
                {{ $t('passenger.bookSimilar') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const activeTab = ref('upcoming')

// Mock data for upcoming rides
const upcomingRides = ref([
  {
    id: 1,
    date: '2025-04-20',
    time: '14:30',
    pickup: { address: 'JFK Airport, New York' },
    destination: { address: 'Times Square, New York' },
    vehicle: { type: 'comfort', name: 'Comfort' },
    price: 75.50,
    status: 'confirmed'
  },
  {
    id: 2,
    date: '2025-04-25',
    time: '09:15',
    pickup: { address: 'Central Park, New York' },
    destination: { address: 'LaGuardia Airport, New York' },
    vehicle: { type: 'business', name: 'Business' },
    price: 95.00,
    status: 'confirmed'
  },
  {
    id: 3,
    date: '2025-05-01',
    time: '16:00',
    pickup: { address: 'Brooklyn Bridge, New York' },
    destination: { address: 'Newark Liberty International Airport, New Jersey' },
    vehicle: { type: 'van', name: 'Van' },
    price: 120.00,
    status: 'confirmed'
  }
])

// Mock data for past rides
const pastRides = ref([
  {
    id: 101,
    date: '2025-03-10',
    time: '11:00',
    pickup: { address: 'Grand Central Terminal, New York' },
    destination: { address: 'Brooklyn Bridge, New York' },
    vehicle: { type: 'economy', name: 'Economy' },
    price: 45.80,
    status: 'completed',
    rating: 5
  },
  {
    id: 102,
    date: '2025-03-15',
    time: '16:45',
    pickup: { address: 'Empire State Building, New York' },
    destination: { address: 'JFK Airport, New York' },
    vehicle: { type: 'suv', name: 'SUV' },
    price: 85.20,
    status: 'completed',
    rating: 4
  },
  {
    id: 103,
    date: '2025-03-20',
    time: '10:30',
    pickup: { address: 'Statue of Liberty, New York' },
    destination: { address: 'Times Square, New York' },
    vehicle: { type: 'economy', name: 'Economy' },
    price: 55.50,
    status: 'cancelled'
  },
  {
    id: 104,
    date: '2025-03-25',
    time: '08:15',
    pickup: { address: 'Wall Street, New York' },
    destination: { address: 'Central Park, New York' },
    vehicle: { type: 'business', name: 'Business' },
    price: 65.00,
    status: 'completed'
  }
])

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Format price for display
function formatPrice(price: number) {
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
function cancelRide(rideId: number) {
  // In a real app, this would call an API
  alert(`Cancelling ride ${rideId}`)
}

// Contact driver
function contactDriver(rideId: number) {
  // In a real app, this would open a chat or show contact info
  alert(`Contacting driver for ride ${rideId}`)
}

// Rate a completed ride
function rateRide(rideId: number) {
  // In a real app, this would open a rating modal
  alert(`Rating ride ${rideId}`)
}

// Book a similar ride
function rebookRide(ride: any) {
  router.push({
    path: '/transfer/new',
    query: {
      pickup: ride.pickup.address,
      destination: ride.destination.address,
      vehicle: ride.vehicle.type
    }
  })
}

// Load any additional data when component is mounted
onMounted(() => {
  // In a real app, this would fetch the user's rides from an API
  console.log('Rides page mounted')
})
</script>

<style scoped>
.rides-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.new-booking-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f86906;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.new-booking-btn:hover {
  background-color: #e55c00;
  text-decoration: none;
}

.rides-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.tab-button.active {
  color: #f86906;
}

.tab-button.active:after {
  background-color: #f86906;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  background-color: #25b847;
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 2.5rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.book-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.book-button:hover {
  background-color: #1e9e3e;
}

.ride-cards {
  display: grid;
  gap: 1rem;
}

.ride-card {
  position: relative;
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

.ride-status {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
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
  flex-wrap: wrap;
}

.cancel-button, .contact-button, .rebook-button, .review-button {
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

.rebook-button {
  background-color: #25b847;
  color: white;
}

.review-button {
  background-color: #f0f0f0;
  color: #666;
}

.ride-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
  color: #ccc;
}

.rating-stars .filled {
  color: #ffc107;
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

  .ride-status {
    position: static;
    margin-bottom: 0.75rem;
    display: inline-block;
  }
}

@media (max-width: 576px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .ride-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .cancel-button,
  .contact-button,
  .rebook-button,
  .review-button {
    width: 100%;
  }
}
</style>
