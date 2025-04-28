<template>
  <div class="earnings-page">
    <div class="page-header">
      <h1>{{ $t('driver.earnings') }}</h1>
      <div class="earnings-summary">
        <div class="total-earnings">
          <div class="amount">${{ totalEarnings.toFixed(2) }}</div>
          <div class="period">{{ activePeriod }}</div>
        </div>
        <div class="period-selector">
          <button
            v-for="period in periods"
            :key="period.value"
            class="period-btn"
            :class="{ 'active': selectedPeriod === period.value }"
            @click="setActivePeriod(period.value)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="earnings-content">
      <div class="statistics-card">
        <div class="stat-row">
          <div class="stat-item">
            <div class="stat-label">{{ $t('driver.completedRides') }}</div>
            <div class="stat-value">{{ statistics.completedRides }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">{{ $t('driver.cancellationRate') }}</div>
            <div class="stat-value">{{ statistics.cancellationRate }}%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">{{ $t('driver.averageRating') }}</div>
            <div class="stat-value rating">
              <span>{{ statistics.averageRating }}</span>
              <div class="stars">
                <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= Math.round(statistics.averageRating) }"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="stat-row">
          <div class="stat-item">
            <div class="stat-label">{{ $t('driver.totalHours') }}</div>
            <div class="stat-value">{{ statistics.totalHours }}h</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">{{ $t('driver.totalDistance') }}</div>
            <div class="stat-value">{{ statistics.totalDistance }} km</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">{{ $t('driver.hourlyRate') }}</div>
            <div class="stat-value">${{ statistics.hourlyRate.toFixed(2) }}/h</div>
          </div>
        </div>
      </div>

      <div class="earnings-chart-card">
        <div class="card-header">
          <h2>{{ $t('driver.earningsOverview') }}</h2>
          <div class="chart-period-selector">
            <button
              v-for="mode in chartModes"
              :key="mode.value"
              class="chart-mode-btn"
              :class="{ 'active': chartMode === mode.value }"
              @click="chartMode = mode.value"
            >
              {{ mode.label }}
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

      <div class="earnings-breakdown-card">
        <h2>{{ $t('driver.earningsBreakdown') }}</h2>
        <div class="breakdown-table">
          <div class="table-header">
            <div class="col date">{{ $t('common.date') }}</div>
            <div class="col rides">{{ $t('driver.rides') }}</div>
            <div class="col hours">{{ $t('driver.hours') }}</div>
            <div class="col distance">{{ $t('driver.distance') }}</div>
            <div class="col earnings">{{ $t('driver.earnings') }}</div>
          </div>
          <div
            v-for="(item, index) in earningsBreakdown"
            :key="index"
            class="table-row"
          >
            <div class="col date">{{ item.date }}</div>
            <div class="col rides">{{ item.rides }}</div>
            <div class="col hours">{{ item.hours }}h</div>
            <div class="col distance">{{ item.distance }} km</div>
            <div class="col earnings">${{ item.earnings.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <div class="payment-history-card">
        <div class="card-header">
          <h2>{{ $t('driver.paymentHistory') }}</h2>
          <button class="export-btn" @click="exportPaymentHistory">
            <i class="fas fa-download"></i>
            {{ $t('driver.exportStatement') }}
          </button>
        </div>
        <div class="payment-table">
          <div class="table-header">
            <div class="col date">{{ $t('common.date') }}</div>
            <div class="col description">{{ $t('driver.description') }}</div>
            <div class="col amount">{{ $t('driver.amount') }}</div>
            <div class="col status">{{ $t('driver.status') }}</div>
          </div>
          <div
            v-for="(payment, index) in paymentHistory"
            :key="index"
            class="table-row"
          >
            <div class="col date">{{ payment.date }}</div>
            <div class="col description">{{ payment.description }}</div>
            <div class="col amount">${{ payment.amount.toFixed(2) }}</div>
            <div class="col status">
              <span class="status-badge" :class="payment.status">
                {{ $t(`driver.${payment.status}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="payment-settings-card">
        <h2>{{ $t('driver.paymentSettings') }}</h2>
        <div class="payment-method">
          <div class="method-header">
            <h3>{{ $t('driver.paymentMethod') }}</h3>
            <button class="edit-btn" @click="editPaymentMethod = !editPaymentMethod">
              <i class="fas fa-pencil-alt"></i>
              {{ editPaymentMethod ? $t('common.cancel') : $t('common.edit') }}
            </button>
          </div>
          <div class="method-content">
            <div v-if="!editPaymentMethod" class="current-method">
              <div class="method-icon">
                <i :class="getPaymentMethodIcon(paymentMethod.type)"></i>
              </div>
              <div class="method-details">
                <div class="method-name">{{ getPaymentMethodName(paymentMethod.type) }}</div>
                <div class="method-info">{{ getPaymentMethodInfo(paymentMethod) }}</div>
              </div>
            </div>
            <div v-else class="method-form">
              <div class="form-group">
                <label for="payment-method-type">{{ $t('driver.methodType') }}</label>
                <select id="payment-method-type" v-model="newPaymentMethod.type">
                  <option value="bank">{{ $t('driver.bankAccount') }}</option>
                  <option value="paypal">{{ $t('driver.paypal') }}</option>
                  <option value="card">{{ $t('driver.debitCard') }}</option>
                </select>
              </div>

              <div v-if="newPaymentMethod.type === 'bank'" class="bank-fields">
                <div class="form-group">
                  <label for="bank-name">{{ $t('driver.bankName') }}</label>
                  <input id="bank-name" type="text" v-model="newPaymentMethod.bankName">
                </div>
                <div class="form-group">
                  <label for="account-name">{{ $t('driver.accountName') }}</label>
                  <input id="account-name" type="text" v-model="newPaymentMethod.accountName">
                </div>
                <div class="form-group">
                  <label for="account-number">{{ $t('driver.accountNumber') }}</label>
                  <input id="account-number" type="text" v-model="newPaymentMethod.accountNumber">
                </div>
                <div class="form-group">
                  <label for="routing-number">{{ $t('driver.routingNumber') }}</label>
                  <input id="routing-number" type="text" v-model="newPaymentMethod.routingNumber">
                </div>
              </div>

              <div v-if="newPaymentMethod.type === 'paypal'" class="paypal-fields">
                <div class="form-group">
                  <label for="paypal-email">{{ $t('driver.paypalEmail') }}</label>
                  <input id="paypal-email" type="email" v-model="newPaymentMethod.email">
                </div>
              </div>

              <div v-if="newPaymentMethod.type === 'card'" class="card-fields">
                <div class="form-group">
                  <label for="card-number">{{ $t('driver.cardNumber') }}</label>
                  <input id="card-number" type="text" v-model="newPaymentMethod.cardNumber">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="card-expiry">{{ $t('driver.expiryDate') }}</label>
                    <input id="card-expiry" type="text" v-model="newPaymentMethod.expiryDate" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label for="card-cvv">{{ $t('driver.cvv') }}</label>
                    <input id="card-cvv" type="text" v-model="newPaymentMethod.cvv" maxlength="3">
                  </div>
                </div>
                <div class="form-group">
                  <label for="card-name">{{ $t('driver.nameOnCard') }}</label>
                  <input id="card-name" type="text" v-model="newPaymentMethod.cardName">
                </div>
              </div>

              <div class="form-actions">
                <button class="save-btn" @click="savePaymentMethod">
                  {{ $t('common.save') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="payout-schedule">
          <h3>{{ $t('driver.payoutSchedule') }}</h3>
          <div class="schedule-options">
            <div
              v-for="option in payoutScheduleOptions"
              :key="option.value"
              class="schedule-option"
              :class="{ 'selected': payoutSchedule === option.value }"
              @click="payoutSchedule = option.value"
            >
              <div class="option-radio">
                <div class="radio-dot"></div>
              </div>
              <div class="option-details">
                <div class="option-name">{{ option.label }}</div>
                <div class="option-description">{{ option.description }}</div>
              </div>
            </div>
          </div>
          <div class="schedule-actions">
            <button class="save-schedule-btn" @click="savePayoutSchedule">
              {{ $t('driver.updateSchedule') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Period selector
const selectedPeriod = ref('month')
const periods = [
  { value: 'week', label: t('driver.thisWeek') },
  { value: 'month', label: t('driver.thisMonth') },
  { value: 'year', label: t('driver.thisYear') },
  { value: 'all', label: t('driver.allTime') }
]

// Chart modes
const chartMode = ref('daily')
const chartModes = [
  { value: 'daily', label: t('driver.daily') },
  { value: 'weekly', label: t('driver.weekly') },
  { value: 'monthly', label: t('driver.monthly') }
]

// Mock data for earnings
const totalEarnings = ref(1250.75)
const statistics = ref({
  completedRides: 28,
  cancellationRate: 2,
  averageRating: 4.8,
  totalHours: 87,
  totalDistance: 674,
  hourlyRate: 14.38
})

// Computed properties for different chart views
const chartData = computed(() => {
  if (chartMode.value === 'daily') {
    return [35, 42, 68, 75, 92, 110, 85]
  } else if (chartMode.value === 'weekly') {
    return [280, 320, 350, 400]
  } else {
    return [980, 1250, 1050, 850, 1100, 1300]
  }
})

const chartLabels = computed(() => {
  if (chartMode.value === 'daily') {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  } else if (chartMode.value === 'weekly') {
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  } else {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  }
})

// Mock data for earnings breakdown
const earningsBreakdown = ref([
  { date: 'April 15, 2025', rides: 5, hours: 8, distance: 120, earnings: 145.50 },
  { date: 'April 14, 2025', rides: 4, hours: 6, distance: 85, earnings: 118.25 },
  { date: 'April 13, 2025', rides: 6, hours: 9, distance: 130, earnings: 167.80 },
  { date: 'April 12, 2025', rides: 3, hours: 5, distance: 70, earnings: 95.50 },
  { date: 'April 11, 2025', rides: 5, hours: 7, distance: 110, earnings: 135.25 },
  { date: 'April 10, 2025', rides: 4, hours: 6, distance: 95, earnings: 125.75 },
  { date: 'April 9, 2025', rides: 5, hours: 8, distance: 140, earnings: 158.50 }
])

// Mock data for payment history
const paymentHistory = ref([
  { date: 'April 14, 2025', description: 'Weekly payout', amount: 725.80, status: 'completed' },
  { date: 'April 7, 2025', description: 'Weekly payout', amount: 682.45, status: 'completed' },
  { date: 'March 31, 2025', description: 'Weekly payout', amount: 730.20, status: 'completed' },
  { date: 'March 24, 2025', description: 'Weekly payout', amount: 695.75, status: 'completed' },
  { date: 'March 17, 2025', description: 'Weekly payout', amount: 610.30, status: 'completed' }
])

// Payment method state
const editPaymentMethod = ref(false)
const paymentMethod = ref({
  type: 'bank',
  bankName: 'Chase Bank',
  accountName: 'Jane Driver',
  accountNumber: '******4567',
  routingNumber: '******789'
})

const newPaymentMethod = ref({
  type: 'bank',
  bankName: '',
  accountName: '',
  accountNumber: '',
  routingNumber: '',
  email: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: ''
})

// Payout schedule
const payoutSchedule = ref('weekly')
const payoutScheduleOptions = [
  {
    value: 'daily',
    label: t('driver.daily'),
    description: t('driver.dailyDesc')
  },
  {
    value: 'weekly',
    label: t('driver.weekly'),
    description: t('driver.weeklyDesc')
  },
  {
    value: 'biweekly',
    label: t('driver.biweekly'),
    description: t('driver.biweeklyDesc')
  },
  {
    value: 'monthly',
    label: t('driver.monthly'),
    description: t('driver.monthlyDesc')
  }
]

// Computed property for displaying the active period
const activePeriod = computed(() => {
  return periods.find(p => p.value === selectedPeriod.value)?.label || ''
})

// Methods
function setActivePeriod(period) {
  selectedPeriod.value = period
  // In a real app, this would fetch data for the selected period

  // Simulate different earnings for different periods
  if (period === 'week') {
    totalEarnings.value = 285.50
  } else if (period === 'month') {
    totalEarnings.value = 1250.75
  } else if (period === 'year') {
    totalEarnings.value = 14875.25
  } else {
    totalEarnings.value = 24680.50
  }
}

function exportPaymentHistory() {
  // In a real app, this would generate and download a CSV or PDF
  alert(t('driver.exportSuccess'))
}

function getPaymentMethodIcon(type) {
  switch (type) {
    case 'bank':
      return 'fas fa-university'
    case 'paypal':
      return 'fab fa-paypal'
    case 'card':
      return 'fas fa-credit-card'
    default:
      return 'fas fa-money-bill-wave'
  }
}

function getPaymentMethodName(type) {
  switch (type) {
    case 'bank':
      return t('driver.bankAccount')
    case 'paypal':
      return t('driver.paypal')
    case 'card':
      return t('driver.debitCard')
    default:
      return t('driver.paymentMethod')
  }
}

function getPaymentMethodInfo(method) {
  switch (method.type) {
    case 'bank':
      return `${method.bankName} - ${method.accountNumber}`
    case 'paypal':
      return method.email
    case 'card':
      return `**** **** **** ${method.cardNumber.slice(-4)}`
    default:
      return ''
  }
}

function savePaymentMethod() {
  // In a real app, this would send the new payment method to the API

  // Update the payment method
  paymentMethod.value = {
    type: newPaymentMethod.value.type,
    bankName: newPaymentMethod.value.bankName,
    accountName: newPaymentMethod.value.accountName,
    accountNumber: newPaymentMethod.value.accountNumber ? `******${newPaymentMethod.value.accountNumber.slice(-4)}` : '',
    routingNumber: newPaymentMethod.value.routingNumber ? `******${newPaymentMethod.value.routingNumber.slice(-3)}` : '',
    email: newPaymentMethod.value.email,
    cardNumber: newPaymentMethod.value.cardNumber ? `****${newPaymentMethod.value.cardNumber.slice(-4)}` : ''
  }

  // Reset the form and exit edit mode
  newPaymentMethod.value = {
    type: 'bank',
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  }

  editPaymentMethod.value = false

  alert(t('driver.paymentMethodSaved'))
}

function savePayoutSchedule() {
  // In a real app, this would send the new payout schedule to the API
  alert(t('driver.payoutScheduleUpdated'))
}

// Initialize component
onMounted(() => {
  // In a real app, this would fetch earnings data from the API

  // Initialize newPaymentMethod with current values
  if (paymentMethod.value.type === 'bank') {
    newPaymentMethod.value.bankName = paymentMethod.value.bankName
    newPaymentMethod.value.accountName = paymentMethod.value.accountName
  } else if (paymentMethod.value.type === 'paypal') {
    newPaymentMethod.value.email = paymentMethod.value.email
  }
})
</script>

<style scoped>
.earnings-page {
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

.earnings-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.total-earnings {
  display: flex;
  flex-direction: column;
}

.total-earnings .amount {
  font-size: 2rem;
  font-weight: 600;
  color: #25b847;
}

.total-earnings .period {
  color: #666;
  font-size: 0.9rem;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn.active {
  background-color: #0366d6;
  color: white;
  border-color: #0366d6;
}

.earnings-content {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.statistics-card,
.earnings-chart-card,
.earnings-breakdown-card,
.payment-history-card,
.payment-settings-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.stat-value.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #ddd;
}

.stars .filled {
  color: #f5a623;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.chart-period-selector {
  display: flex;
  gap: 0.5rem;
}

.chart-mode-btn {
  padding: 0.5rem 0.75rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-mode-btn.active {
  background-color: #0366d6;
  color: white;
  border-color: #0366d6;
}

.chart-container {
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  position: relative;
}

.chart-mock {
  height: 250px;
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

.earnings-breakdown-card h2,
.payment-history-card h2,
.payment-settings-card h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.breakdown-table,
.payment-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

.table-row {
  display: flex;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  padding-right: 1rem;
}

.col.date {
  width: 25%;
}

.col.rides,
.col.hours,
.col.distance {
  width: 15%;
}

.col.earnings {
  width: 30%;
  text-align: right;
  font-weight: 500;
  color: #25b847;
}

.col.description {
  width: 40%;
}

.col.amount {
  width: 20%;
  text-align: right;
  font-weight: 500;
}

.col.status {
  width: 15%;
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.completed {
  background-color: #e3f7eb;
  color: #25b847;
}

.status-badge.pending {
  background-color: #fff5e6;
  color: #f5a623;
}

.status-badge.failed {
  background-color: #ffebee;
  color: #e53935;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.export-btn:hover {
  background-color: #0255b3;
}

.payment-method,
.payout-schedule {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.payment-method:last-child,
.payout-schedule:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.method-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.method-header h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #0366d6;
  font-size: 0.9rem;
  cursor: pointer;
}

.current-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.method-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f2ff;
  color: #0366d6;
  border-radius: 8px;
  font-size: 1.25rem;
}

.method-details {
  flex: 1;
}

.method-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.method-info {
  font-size: 0.9rem;
  color: #666;
}

.method-form {
  background-color: #f9fcff;
  border: 1px solid #c8e1ff;
  border-radius: 8px;
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-btn:hover {
  background-color: #0255b3;
}

.payout-schedule h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1.25rem;
}

.schedule-options {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.schedule-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.schedule-option:hover {
  border-color: #c8e1ff;
}

.schedule-option.selected {
  border-color: #0366d6;
  background-color: #f0f7ff;
}

.option-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.schedule-option.selected .option-radio {
  border-color: #0366d6;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #0366d6;
  display: none;
}

.schedule-option.selected .radio-dot {
  display: block;
}

.option-details {
  flex: 1;
}

.option-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.option-description {
  font-size: 0.9rem;
  color: #666;
}

.schedule-actions {
  display: flex;
  justify-content: flex-end;
}

.save-schedule-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-schedule-btn:hover {
  background-color: #0255b3;
}

@media (min-width: 1024px) {
  .earnings-content {
    grid-template-columns: 2fr 1fr;
  }

  .statistics-card,
  .earnings-chart-card,
  .earnings-breakdown-card {
    grid-column: 1;
  }

  .payment-history-card,
  .payment-settings-card {
    grid-column: 2;
    grid-row: span 2;
  }
}

@media (max-width: 992px) {
  .stat-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item:last-child {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .earnings-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .period-selector {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .stat-row {
    grid-template-columns: 1fr;
  }

  .stat-item {
    grid-column: 1 !important;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    font-size: 0.9rem;
  }

  .col.date {
    width: 30%;
  }

  .col.rides,
  .col.hours,
  .col.distance {
    width: 20%;
  }

  .col.earnings {
    width: 30%;
  }
}

@media (max-width: 576px) {
  .table-header,
  .table-row {
    display: block;
    position: relative;
    padding: 1rem;
  }

  .table-row {
    margin-bottom: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  .table-header {
    display: none;
  }

  .col {
    display: flex;
    justify-content: space-between;
    width: 100% !important;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .col:last-child {
    border-bottom: none;
  }

  .col::before {
    content: attr(data-label);
    font-weight: 500;
  }
}
</style>
