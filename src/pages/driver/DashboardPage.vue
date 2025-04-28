<template>
  <div class="driver-dashboard">
    <div class="dashboard-header">
      <h1>{{ $t('driver.dashboard') }}</h1>
      <div class="driver-status">
        <span class="status-label">{{ $t('driver.status') }}:</span>
        <div class="status-toggle">
          <button
            class="status-btn"
            :class="{ 'active': isOnline }"
            @click="toggleStatus"
          >
            <span class="status-indicator" :class="{ 'online': isOnline, 'offline': !isOnline }"></span>
            {{ isOnline ? $t('driver.online') : $t('driver.offline') }}
          </button>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="dashboard-summary">
        <div class="summary-card earnings">
          <div class="card-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="card-content">
            <h3>{{ $t('driver.earnings') }}</h3>
            <div class="card-value">${{ totalEarnings.toFixed(2) }}</div>
            <div class="card-period">{{ $t('driver.thisMonth') }}</div>
          </div>
        </div>

        <div class="summary-card rides">
          <div class="card-icon">
            <i class="fas fa-car"></i>
          </div>
          <div class="card-content">
            <h3>{{ $t('driver.completedRides') }}</h3>
            <div class="card-value">{{ completedRides }}</div>
            <div class="card-period">{{ $t('driver.thisMonth') }}</div>
          </div>
        </div>

        <div class="summary-card rating">
          <div class="card-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="card-content">
            <h3>{{ $t('driver.rating') }}</h3>
            <div class="card-value">{{ averageRating }}/5</div>
            <div class="card-period">
              <div class="stars">
                <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= Math.floor(averageRating) }"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-card hours">
          <div class="card-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="card-content">
            <h3>{{ $t('driver.activeHours') }}</h3>
            <div class="card-value">{{ activeHours }}</div>
            <div class="card-period">{{ $t('driver.thisMonth') }}</div>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2>{{ $t('driver.upcomingRides') }}</h2>
          <router-link to="/driver/rides" class="view-all">
            {{ $t('driver.viewAll') }}
          </router-link>
        </div>

        <div v-if="upcomingRides.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-calendar-day"></i>
          </div>
          <p>{{ $t('driver.noUpcomingRides') }}</p>
          <p class="empty-subtitle">{{ $t('driver.stayOnlineMessage') }}</p>
        </div>

        <div v-else class="rides-list">
          <div
            v-for="ride in upcomingRides"
            :key="ride.id"
            class="ride-card"
            @click="viewRideDetails(ride.id)"
          >
            <div class="ride-time">
              <div class="date">{{ formatDate(ride.date) }}</div>
              <div class="time">{{ ride.time }}</div>
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
                  <span>{{ getVehicleName(ride.vehicleType) }}</span>
                </div>
              </div>
            </div>
            <div class="ride-price">
              <div class="price-amount">${{ ride.price.toFixed(2) }}</div>
              <div class="distance">{{ ride.distance }} km</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="earnings-chart">
          <div class="chart-header">
            <h2>{{ $t('driver.earningsChart') }}</h2>
            <div class="period-selector">
              <button
                v-for="period in ['week', 'month', 'year']"
                :key="period"
                class="period-btn"
                :class="{ 'active': chartPeriod === period }"
                @click="chartPeriod = period"
              >
                {{ $t(`driver.${period}`) }}
              </button>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-mock">
                <div
                  v-for="(value, index) in chartData"
                  :key="index"
                  class="chart-bar"
                  :style="{ height: `${(value / Math.max(...chartData)) * 100}%` }"
                >
                  <div class="bar-value">${{ value }}</div>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="(label, index) in chartLabels" :key="index">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="performance-stats">
          <h2>{{ $t('driver.performance') }}</h2>
          <div class="stats-list">
            <div class="stat-item">
              <div class="stat-label">{{ $t('driver.acceptanceRate') }}</div>
              <div class="stat-value">
                <div class="progress-bar" :style="{ width: `${stats.acceptanceRate}%` }"></div>
                <span>{{ stats.acceptanceRate }}%</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('driver.completionRate') }}</div>
              <div class="stat-value">
                <div class="progress-bar" :style="{ width: `${stats.completionRate}%` }"></div>
                <span>{{ stats.completionRate }}%</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('driver.onTimeRate') }}</div>
              <div class="stat-value">
                <div class="progress-bar" :style="{ width: `${stats.onTimeRate}%` }"></div>
                <span>{{ stats.onTimeRate }}%</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('driver.cancelRate') }}</div>
              <div class="stat-value">
                <div class="progress-bar" :style="{ width: `${stats.cancelRate}%` }"></div>
                <span>{{ stats.cancelRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2>{{ $t('driver.recentActivity') }}</h2>
        </div>
        <div class="activity-list">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              <i :class="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-description">{{ activity.description }}</div>
            </div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

// Driver online status
const isOnline = ref(true)

// Toggle online status
function toggleStatus() {
  isOnline.value = !isOnline.value
}

// Mock data for dashboard
const totalEarnings = ref(1250.75)
const completedRides = ref(28)
const averageRating = ref(4.8)
const activeHours = ref(87)

// Mock data for performance stats
const stats = ref({
  acceptanceRate: 94,
  completionRate: 98,
  onTimeRate: 92,
  cancelRate: 2
})

// Mock data for chart
const chartPeriod = ref('week')

// Generate chart data based on selected period
const chartData = computed(() => {
  if (chartPeriod.value === 'week') {
    return [35, 42, 68, 75, 92, 110, 85]
  } else if (chartPeriod.value === 'month') {
    return [280, 320, 350, 400]
  } else {
    return [3200, 2800, 3600, 3900, 4200, 3800, 3500, 3900, 4100, 4500, 4800, 5200]
  }
})

// Generate chart labels based on selected period
const chartLabels = computed(() => {
  if (chartPeriod.value === 'week') {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  } else if (chartPeriod.value === 'month') {
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  } else {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
})

// Mock data for upcoming rides
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
  }
])

// Mock data for recent activities
const recentActivities = ref([
  {
    type: 'payment',
    title: t('driver.paymentReceived'),
    description: t('driver.paymentReceivedDesc', { amount: '$45.80' }),
    time: '2 hours ago'
  },
  {
    type: 'ride',
    title: t('driver.rideCompleted'),
    description: t('driver.rideCompletedDesc', { from: 'Grand Central Terminal', to: 'Brooklyn Bridge' }),
    time: '5 hours ago'
  },
  {
    type: 'rating',
    title: t('driver.newRating'),
    description: t('driver.newRatingDesc', { rating: '5', passenger: 'David Wilson' }),
    time: '6 hours ago'
  },
  {
    type: 'system',
    title: t('driver.systemNotification'),
    description: t('driver.systemNotificationDesc', { message: t('driver.maintenanceReminder') }),
    time: '1 day ago'
  }
])

// Format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Get vehicle icon
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

// Get vehicle name
function getVehicleName(vehicleType: string) {
  return t(`booking.${vehicleType}`)
}

// Get activity icon
function getActivityIcon(type: string) {
  switch (type) {
    case 'payment':
      return 'fas fa-money-bill-wave'
    case 'ride':
      return 'fas fa-car'
    case 'rating':
      return 'fas fa-star'
    case 'system':
      return 'fas fa-bell'
    default:
      return 'fas fa-info-circle'
  }
}

// View ride details
function viewRideDetails(rideId: number) {
  router.push(`/driver/rides/${rideId}`)
}
</script>

<style scoped>
.driver-dashboard {
  padding: 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.driver-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-label {
  font-size: 0.9rem;
  color: #666;
}

.status-toggle {
  display: flex;
  align-items: center;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  background-color: #f5f5f5;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-btn.active {
  background-color: #f0f8ff;
  border-color: #c8e1ff;
  color: #0366d6;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.online {
  background-color: #25b847;
  box-shadow: 0 0 0 2px rgba(37, 184, 71, 0.2);
}

.status-indicator.offline {
  background-color: #999;
  box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.2);
}

.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.5rem;
}

.summary-card.earnings .card-icon {
  background-color: #e3f7eb;
  color: #25b847;
}

.summary-card.rides .card-icon {
  background-color: #e6f2ff;
  color: #0366d6;
}

.summary-card.rating .card-icon {
  background-color: #fff5e6;
  color: #f5a623;
}

.summary-card.hours .card-icon {
  background-color: #f0f0f0;
  color: #666;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.25rem;
  font-weight: 400;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-period {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
}

.stars {
  color: #ddd;
  font-size: 0.8rem;
}

.stars .filled {
  color: #f5a623;
}

.dashboard-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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
  margin: 0;
}

.view-all {
  color: #0366d6;
  text-decoration: none;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
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
}

.ride-card {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
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
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding-right: 1rem;
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

.ride-details {
  flex: 1;
  padding: 0 1rem;
}

.route {
  margin-bottom: 0.75rem;
}

.pickup, .destination {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
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
  gap: 1rem;
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
  min-width: 100px;
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

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.earnings-chart, .performance-stats {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.period-btn.active {
  background-color: #0366d6;
  color: white;
  border-color: #0366d6;
}

.chart-container {
  height: 250px;
}

.chart-placeholder {
  height: 100%;
  position: relative;
}

.chart-mock {
  height: 220px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chart-bar {
  flex: 1;
  background-color: #0366d6;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  min-height: 5px;
}

.bar-value {
  position: absolute;
  top: -25px;
  font-size: 0.8rem;
  color: #666;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.chart-labels span {
  flex: 1;
  text-align: center;
  font-size: 0.8rem;
  color: #999;
}

.performance-stats h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 1.5rem;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  height: 8px;
  background-color: #25b847;
  border-radius: 4px;
  flex: 1;
}

.stat-value span {
  font-weight: 500;
  color: #333;
  min-width: 40px;
  text-align: right;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-icon.payment {
  background-color: #e3f7eb;
  color: #25b847;
}

.activity-icon.ride {
  background-color: #e6f2ff;
  color: #0366d6;
}

.activity-icon.rating {
  background-color: #fff5e6;
  color: #f5a623;
}

.activity-icon.system {
  background-color: #f0f0f0;
  color: #666;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.activity-description {
  font-size: 0.9rem;
  color: #666;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
  text-align: right;
  min-width: 90px;
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .ride-card {
    flex-direction: column;
    gap: 1rem;
  }

  .ride-time {
    flex-direction: row;
    justify-content: flex-start;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 0.75rem;
    width: 100%;
  }

  .date {
    margin-right: 0.5rem;
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

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .activity-time {
    text-align: left;
  }
}
</style>
