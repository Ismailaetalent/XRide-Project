<template>
  <div class="availability-page">
    <h1>{{ $t('driver.availability') }}</h1>
    <p class="page-subtitle">{{ $t('driver.availabilityDesc') }}</p>

    <div class="availability-content">
      <div class="status-card">
        <div class="status-header">
          <h2>{{ $t('driver.currentStatus') }}</h2>
          <div class="status-toggle">
            <button
              class="toggle-btn"
              :class="{ 'active': isAvailable }"
              @click="toggleAvailability"
            >
              <span class="status-indicator" :class="{ 'available': isAvailable, 'unavailable': !isAvailable }"></span>
              {{ isAvailable ? $t('driver.available') : $t('driver.unavailable') }}
            </button>
          </div>
        </div>
        <div class="status-message">
          <p v-if="isAvailable">{{ $t('driver.availableMessage') }}</p>
          <p v-else>{{ $t('driver.unavailableMessage') }}</p>
        </div>
      </div>

      <div class="break-section">
        <h2>{{ $t('driver.takeBreak') }}</h2>
        <div class="break-options">
          <div
            v-for="option in breakOptions"
            :key="option.value"
            class="break-option"
            :class="{ 'selected': breakDuration === option.value }"
            @click="selectBreakDuration(option.value)"
          >
            <div class="option-icon">
              <i :class="option.icon"></i>
            </div>
            <div class="option-label">{{ option.label }}</div>
          </div>
        </div>
        <div class="break-actions">
          <button
            class="break-btn"
            :disabled="breakDuration === 0 || onBreak"
            @click="startBreak"
          >
            {{ $t('driver.startBreak') }}
          </button>
        </div>
      </div>

      <div class="schedule-section">
        <div class="section-header">
          <h2>{{ $t('driver.weeklySchedule') }}</h2>
          <button class="edit-btn" @click="editSchedule = !editSchedule">
            <i class="fas fa-pencil-alt"></i>
            {{ editSchedule ? $t('common.done') : $t('common.edit') }}
          </button>
        </div>

        <div class="schedule-grid">
          <div
            v-for="day in weekDays"
            :key="day.value"
            class="day-card"
            :class="{ 'day-off': !workingDays[day.value], 'editable': editSchedule }"
          >
            <div class="day-header">
              <div class="day-name">{{ day.label }}</div>
              <div class="day-toggle" v-if="editSchedule">
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="workingDays[day.value]"
                    @change="updateSchedule"
                  >
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <div class="day-schedule" v-if="workingDays[day.value]">
              <div class="time-row">
                <div class="time-label">{{ $t('driver.from') }}</div>
                <select
                  v-model="workHours[day.value].start"
                  :disabled="!editSchedule"
                  @change="updateSchedule"
                >
                  <option
                    v-for="time in timeOptions"
                    :key="time.value"
                    :value="time.value"
                  >
                    {{ time.label }}
                  </option>
                </select>
              </div>
              <div class="time-row">
                <div class="time-label">{{ $t('driver.to') }}</div>
                <select
                  v-model="workHours[day.value].end"
                  :disabled="!editSchedule"
                  @change="updateSchedule"
                >
                  <option
                    v-for="time in timeOptions.filter(t => t.value > workHours[day.value].start)"
                    :key="time.value"
                    :value="time.value"
                  >
                    {{ time.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="day-off-label" v-else>
              {{ $t('driver.dayOff') }}
            </div>
          </div>
        </div>
      </div>

      <div class="vacation-section">
        <h2>{{ $t('driver.vacationTime') }}</h2>
        <p class="section-subtitle">{{ $t('driver.vacationDesc') }}</p>

        <div class="vacation-form">
          <div class="form-row">
            <div class="form-group">
              <label for="vacation-start">{{ $t('driver.startDate') }}</label>
              <input
                id="vacation-start"
                type="date"
                v-model="vacationStart"
                :min="getTodayDate()"
              >
            </div>
            <div class="form-group">
              <label for="vacation-end">{{ $t('driver.endDate') }}</label>
              <input
                id="vacation-end"
                type="date"
                v-model="vacationEnd"
                :min="vacationStart"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="vacation-notes">{{ $t('driver.notes') }}</label>
            <textarea
              id="vacation-notes"
              v-model="vacationNotes"
              rows="3"
              :placeholder="$t('driver.notesPlaceholder')"
            ></textarea>
          </div>
          <div class="form-actions">
            <button
              class="submit-btn"
              :disabled="!vacationStart || !vacationEnd"
              @click="requestVacation"
            >
              {{ $t('driver.requestVacation') }}
            </button>
          </div>
        </div>
      </div>

      <div class="upcoming-section" v-if="upcomingVacations.length > 0">
        <h2>{{ $t('driver.upcomingVacations') }}</h2>
        <div class="vacation-list">
          <div
            v-for="(vacation, index) in upcomingVacations"
            :key="index"
            class="vacation-card"
          >
            <div class="vacation-dates">
              <div class="date-range">
                <i class="fas fa-calendar-alt"></i>
                {{ formatDate(vacation.startDate) }} - {{ formatDate(vacation.endDate) }}
              </div>
              <div class="status-badge" :class="vacation.status">
                {{ $t(`driver.${vacation.status}`) }}
              </div>
            </div>
            <div class="vacation-actions" v-if="vacation.status === 'pending'">
              <button class="cancel-btn" @click="cancelVacation(index)">
                {{ $t('common.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// General availability state
const isAvailable = ref(true)
const onBreak = ref(false)
const breakDuration = ref(0)
const breakOptions = [
  { value: 30, label: '30 min', icon: 'fas fa-coffee' },
  { value: 60, label: '1 hour', icon: 'fas fa-utensils' },
  { value: 120, label: '2 hours', icon: 'fas fa-bed' },
  { value: 240, label: '4 hours', icon: 'fas fa-moon' }
]

// Weekly schedule state
const editSchedule = ref(false)
const weekDays = [
  { value: 'monday', label: t('driver.monday') },
  { value: 'tuesday', label: t('driver.tuesday') },
  { value: 'wednesday', label: t('driver.wednesday') },
  { value: 'thursday', label: t('driver.thursday') },
  { value: 'friday', label: t('driver.friday') },
  { value: 'saturday', label: t('driver.saturday') },
  { value: 'sunday', label: t('driver.sunday') }
]

// Create time options from 00:00 to 23:30 in 30-minute increments
const timeOptions = []
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const hourStr = hour.toString().padStart(2, '0')
    const minuteStr = minute.toString().padStart(2, '0')
    timeOptions.push({
      value: hour * 60 + minute,
      label: `${hourStr}:${minuteStr}`
    })
  }
}

// Initialize working days and hours
const workingDays = reactive({
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false
})

const workHours = reactive({
  monday: { start: 9 * 60, end: 17 * 60 },       // 9:00 - 17:00
  tuesday: { start: 9 * 60, end: 17 * 60 },
  wednesday: { start: 9 * 60, end: 17 * 60 },
  thursday: { start: 9 * 60, end: 17 * 60 },
  friday: { start: 9 * 60, end: 17 * 60 },
  saturday: { start: 10 * 60, end: 16 * 60 },    // 10:00 - 16:00
  sunday: { start: 10 * 60, end: 16 * 60 }
})

// Vacation state
const vacationStart = ref('')
const vacationEnd = ref('')
const vacationNotes = ref('')
const upcomingVacations = ref([
  {
    startDate: '2025-05-15',
    endDate: '2025-05-22',
    notes: 'Family vacation',
    status: 'approved'
  },
  {
    startDate: '2025-07-01',
    endDate: '2025-07-10',
    notes: 'Summer holiday',
    status: 'pending'
  }
])

// Methods
function toggleAvailability() {
  isAvailable.value = !isAvailable.value
}

function selectBreakDuration(duration) {
  breakDuration.value = duration
}

function startBreak() {
  if (breakDuration.value > 0) {
    onBreak.value = true
    isAvailable.value = false

    // In a real app, this would make an API call to update availability
    alert(t('driver.breakStarted', { duration: breakDuration.value }))

    // Simulate break ending
    setTimeout(() => {
      onBreak.value = false
      isAvailable.value = true
      alert(t('driver.breakEnded'))
    }, breakDuration.value * 60 * 1000)
  }
}

function updateSchedule() {
  // In a real app, this would make an API call to update schedule
  console.log('Schedule updated:', { workingDays, workHours })
}

function requestVacation() {
  if (vacationStart.value && vacationEnd.value) {
    // Add new vacation request
    upcomingVacations.value.push({
      startDate: vacationStart.value,
      endDate: vacationEnd.value,
      notes: vacationNotes.value,
      status: 'pending'
    })

    // Reset form
    vacationStart.value = ''
    vacationEnd.value = ''
    vacationNotes.value = ''

    // In a real app, this would make an API call
    alert(t('driver.vacationRequested'))
  }
}

function cancelVacation(index) {
  // Remove vacation request
  upcomingVacations.value.splice(index, 1)

  // In a real app, this would make an API call
  alert(t('driver.vacationCancelled'))
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Initialize data
onMounted(() => {
  // In a real app, this would fetch availability data from the API
})
</script>

<style scoped>
.availability-page {
  padding: 1.5rem;
}

h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #666;
  margin-bottom: 1.5rem;
}

.availability-content {
  display: grid;
  gap: 1.5rem;
}

.status-card,
.break-section,
.schedule-section,
.vacation-section,
.upcoming-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-header h2,
.break-section h2,
.schedule-section h2,
.vacation-section h2,
.upcoming-section h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.toggle-btn {
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

.toggle-btn.active {
  background-color: #e3f7eb;
  border-color: #c8e6d2;
  color: #25b847;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.available {
  background-color: #25b847;
  box-shadow: 0 0 0 2px rgba(37, 184, 71, 0.2);
}

.status-indicator.unavailable {
  background-color: #999;
  box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.2);
}

.status-message {
  color: #666;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #0366d6;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.break-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.break-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.break-option:hover {
  background-color: #f9f9f9;
}

.break-option.selected {
  background-color: #e6f2ff;
  border-color: #c8e1ff;
}

.option-icon {
  font-size: 1.5rem;
  color: #0366d6;
  margin-bottom: 0.5rem;
}

.option-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.break-actions {
  display: flex;
  justify-content: center;
}

.break-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.break-btn:hover:not(:disabled) {
  background-color: #0255b3;
}

.break-btn:disabled {
  background-color: #a5c8ef;
  cursor: not-allowed;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.day-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.day-card.day-off {
  background-color: #f9f9f9;
}

.day-card.editable {
  border-color: #c8e1ff;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.day-name {
  font-weight: 500;
  color: #333;
}

/* Toggle switch styles */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: .2s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: .2s;
}

input:checked + .slider {
  background-color: #25b847;
}

input:focus + .slider {
  box-shadow: 0 0 1px #25b847;
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.day-schedule {
  display: grid;
  gap: 0.75rem;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-label {
  width: 40px;
  color: #666;
  font-size: 0.9rem;
}

.time-row select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
}

.day-off-label {
  color: #999;
  text-align: center;
  font-style: italic;
  padding: 0.75rem 0;
}

.section-subtitle {
  color: #666;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}

.vacation-form {
  margin-top: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1e9e3e;
}

.submit-btn:disabled {
  background-color: #a6ddb6;
  cursor: not-allowed;
}

.vacation-list {
  display: grid;
  gap: 1rem;
}

.vacation-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-weight: 500;
}

.date-range i {
  color: #0366d6;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 0.75rem;
}

.status-badge.approved {
  background-color: #e3f7eb;
  color: #25b847;
}

.status-badge.pending {
  background-color: #fff5e6;
  color: #f5a623;
}

.status-badge.rejected {
  background-color: #ffebee;
  color: #e53935;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #e53935;
  border: 1px solid #e53935;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #ffebee;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .schedule-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .break-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .vacation-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .vacation-dates {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
