<template>
  <div class="driver-rides">
    <div class="page-header">
      <h1>{{ $t('driver.rides') }}</h1>
      <div class="filter-tabs">
        <button
          class="tab-button"
          :class="{ 'active': activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
        >
          {{ $t('driver.upcomingRides') }}
        </button>
        <button
          class="tab-button"
          :class="{ 'active': activeTab === 'completed' }"
          @click="activeTab = 'completed'"
        >
          {{ $t('driver.completedRides') }}
        </button>
        <button
          class="tab-button"
          :class="{ 'active': activeTab === 'canceled' }"
          @click="activeTab = 'canceled'"
        >
          {{ $t('driver.canceledRides') }}
        </button>
      </div>
    </div>

    <div class="rides-filter">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('common.search')"
        >
      </div>
      <div class="date-filter">
        <select v-model="dateFilter">
          <option value="all">{{ $t('driver.allTime') }}</option>
          <option value="today">{{ $t('driver.today') }}</option>
          <option value="week">{{ $t('driver.thisWeek') }}</option>
          <option value="month">{{ $t('driver.thisMonth') }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="filteredRides.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-car"></i>
      </div>
      <p>{{ $t(`driver.no${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}Rides`) }}</p>
      <p v-if="activeTab === 'upcoming'" class="empty-subtitle">{{ $t('driver.stayOnlineMessage') }}</p>
    </div>

    <div v-else class="rides-list">
      <div
        v-for="ride in filteredRides"
        :key="ride.id"
        class="ride-card"
        @click="viewRideDetails(ride.id)"
      >
        <div class="ride-time">
          <div class="date">{{ formatDate(ride.date) }}</div>
          <div class="time">{{ ride.time }}</div>
          <div class="status-badge" :class="ride.status">
            {{ $t(`passenger.${ride.status}`) }}
          </div>
        </div>
        <div class="ride-details">
          <div class="route">
            <div class="pickup">
              <i class="fas fa-map-marker-alt pickup-icon"></i>
              <span>{{ ride.pickup.address }}</span>
            </div>
            <div class="destination">
              <i class="fas fa-map-marker-alt destination-icon"></i>
              <span>{{ ride.destination.address }}</span>
            </div>
          </div>
          <div class="ride-info">
            <div class="passenger-info">
              <i class="fas fa-user"></i>
              <span>{{ ride.passenger.name }}</span>
            </div>
            <div class="ride-type">
              <i :class="getVehicleIcon(ride.vehicleType)"></i>
              <span>{{ $t(`booking.${ride.vehicleType}`) }}</span>
            </div>
          </div>
        </div>
        <div class="ride-price">
          <div class="price-amount">${{ ride.price.toFixed(2) }}</div>
          <div class="distance">{{ ride.distance }} km</div>
          <div class="earnings" v-if="activeTab === 'completed'">
            {{ $t('driver.earnings') }}: <strong>${{ (ride.price * 0.8).toFixed(2) }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="pagination-info">
        {{ $t('common.page') }} {{ currentPage }} {{ $t('common.of') }} {{ totalPages }}
      </div>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// State
const activeTab = ref('upcoming')
const searchQuery = ref('')
const dateFilter = ref('all')
const currentPage = ref(1)
const loading = ref(true)

// Mock rides data
const upcomingRides = ref([
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
    status: 'confirmed'
  }
])

const completedRides = ref([
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
  },
  {
    id: 102,
    date: '2025-04-14',
    time: '14:15',
    pickup: { address: 'Metropolitan Museum, New York' },
    destination: { address: 'Columbia University, New York' },
    passenger: { name: 'Robert Miller', phone: '+1 555-444-5555' },
    vehicleType: 'comfort',
    price: 48.50,
    distance: 12,
    status: 'completed',
    rating: 4
  },
  {
    id: 103,
    date: '2025-04-10',
    time: '19:30',
    pickup: { address: 'Barclays Center, Brooklyn' },
    destination: { address: 'Madison Square Garden, New York' },
    passenger: { name: 'Jennifer Davis', phone: '+1 555-666-7777' },
    vehicleType: 'premium',
    price: 85.25,
    distance: 22,
    status: 'completed',
    rating: 5
  }
])

const canceledRides = ref([
  {
    id: 201,
    date: '2025-04-12',
    time: '16:45',
    pickup: { address: 'Hudson Yards, New York' },
    destination: { address: 'Newark Airport, New Jersey' },
    passenger: { name: 'Thomas Wilson', phone: '+1 555-888-9999' },
    vehicleType: 'van',
    price: 115.00,
    distance: 35,
    status: 'cancelled',
    cancelReason: 'Passenger canceled the ride'
  }
])

// Computed properties
const filteredRides = computed(() => {
  let rides = []

  // Select rides based on active tab
  if (activeTab.value === 'upcoming') {
    rides = upcomingRides.value
  } else if (activeTab.value === 'completed') {
    rides = completedRides.value
  } else if (activeTab.value === 'canceled') {
    rides = canceledRides.value
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rides = rides.filter(ride =>
      ride.pickup.address.toLowerCase().includes(query) ||
      ride.destination.address.toLowerCase().includes(query) ||
      ride.passenger.name.toLowerCase().includes(query)
    )
  }

  // Apply date filter
  if (dateFilter.value !== 'all') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    const monthStart = new Date(today)
    monthStart.setDate(1)

    rides = rides.filter(ride => {
      const rideDate = new Date(ride.date)
      rideDate.setHours(0, 0, 0, 0)

      if (dateFilter.value === 'today') {
        return rideDate.getTime() === today.getTime()
      } else if (dateFilter.value === 'week') {
        return rideDate >= weekStart
      } else if (dateFilter.value === 'month') {
        return rideDate >= monthStart
      }

      return true
    })
  }

  return rides
})

const totalPages = computed(() => {
  const itemsPerPage = 10
  return Math.ceil(filteredRides.value.length / itemsPerPage)
})

// Methods
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

function viewRideDetails(rideId) {
  router.push(`/driver/rides/${rideId}`)
}

// Watchers
watch(activeTab, () => {
  // Reset pagination when tab changes
  currentPage.value = 1
})

// Lifecycle hooks
onMounted(() => {
  // Simulate loading data
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.driver-rides {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 1rem;
}

.filter-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #0366d6;
  border-bottom: 2px solid #0366d6;
  font-weight: 500;
}

.rides-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.date-filter select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.loading-state, .empty-state {
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

.empty-icon {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 0.9rem;
  color: #999;
}

.rides-list {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ride-card {
  display: flex;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ride-card:hover {
  border-color: #c8e1ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ride-time {
  display: flex;
  flex-direction: column;
  min-width: 100px;
  padding-right: 1.25rem;
  border-right: 1px solid #eee;
}

.date {
  font-weight: 500;
  color: #333;
}

.time {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.status-badge {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.confirmed {
  background-color: #e3f7eb;
  color: #25b847;
}

.status-badge.completed {
  background-color: #e6f2ff;
  color: #0366d6;
}

.status-badge.cancelled {
  background-color: #ffebee;
  color: #e53935;
}

.status-badge.inProgress {
  background-color: #fff5e6;
  color: #f5a623;
}

.ride-details {
  flex: 1;
  padding: 0 1.25rem;
}

.route {
  margin-bottom: 0.75rem;
}

.pickup, .destination {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.pickup-icon {
  color: #f86906;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.destination-icon {
  color: #25b847;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.ride-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.passenger-info, .ride-type {
  display: flex;
  align-items: center;
}

.passenger-info i, .ride-type i {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.ride-price {
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.price-amount {
  font-weight: 600;
  color: #333;
}

.distance {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
}

.earnings {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.earnings strong {
  color: #25b847;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 992px) {
  .ride-card {
    flex-direction: column;
    gap: 1rem;
  }

  .ride-time {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 0.75rem;
    width: 100%;
  }

  .date {
    margin-right: 0.5rem;
  }

  .time {
    margin-top: 0;
    margin-right: 0.5rem;
  }

  .status-badge {
    margin-top: 0;
    margin-left: auto;
  }

  .ride-details {
    padding: 0;
  }

  .ride-price {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .distance, .earnings {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .rides-filter {
    flex-direction: column;
    gap: 1rem;
  }

  .search-bar {
    max-width: 100%;
  }

  .filter-tabs {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 0.25rem;
  }

  .tab-button {
    padding: 0.75rem 1rem;
  }

  .ride-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
