<template>
  <div class="driver-layout">
    <header class="driver-header">
      <div class="header-content">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="../assets/logo.png" alt="GetTransfer" class="logo-img">
          </router-link>
        </div>
        <div class="user-actions">
          <div class="status-toggle">
            <span class="status-label">{{ $t('driver.status') }}:</span>
            <label class="switch">
              <input v-model="isOnline" type="checkbox" @change="toggleOnlineStatus">
              <span class="slider round" />
            </label>
            <span class="status-text" :class="{ 'online': isOnline }">
              {{ isOnline ? $t('driver.online') : $t('driver.offline') }}
            </span>
          </div>
          <div class="notifications">
            <button class="notification-btn">
              <i class="far fa-bell" />
              <span v-if="notifications.length > 0" class="notification-badge">{{ notifications.length }}</span>
            </button>
          </div>
          <div class="user-menu">
            <span class="user-name">{{ user.name }}</span>
            <div class="user-avatar">
              <img v-if="user.avatar" :src="user.avatar" alt="User avatar">
              <div v-else class="avatar-placeholder">{{ userInitials }}</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="driver-container">
      <aside class="driver-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/driver/dashboard" class="nav-item" exact>
            <i class="fas fa-tachometer-alt" />
            <span>{{ $t('nav.dashboard') }}</span>
          </router-link>
          <router-link to="/driver/rides" class="nav-item">
            <i class="fas fa-car" />
            <span>{{ $t('driver.rides') }}</span>
          </router-link>
          <router-link to="/driver/availability" class="nav-item">
            <i class="fas fa-calendar-alt" />
            <span>{{ $t('driver.availability') }}</span>
          </router-link>
          <router-link to="/driver/earnings" class="nav-item">
            <i class="fas fa-money-bill-wave" />
            <span>{{ $t('driver.earnings') }}</span>
          </router-link>
          <router-link to="/driver/vehicle" class="nav-item">
            <i class="fas fa-car-side" />
            <span>{{ $t('driver.vehicle') }}</span>
          </router-link>
          <router-link to="/driver/profile" class="nav-item">
            <i class="fas fa-user" />
            <span>{{ $t('nav.profile') }}</span>
          </router-link>
          <button @click="logout" class="nav-item logout-btn">
            <i class="fas fa-sign-out-alt" />
            <span>{{ $t('nav.logout') }}</span>
          </button>
        </nav>
      </aside>

      <main class="driver-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

useI18n()
const router = useRouter()

// Mock driver data - will be replaced with Pinia store
const user = ref({
  id: 1,
  name: 'John Driver',
  email: 'john.driver@example.com',
  avatar: null,
  rating: 4.8,
  completedRides: 145
})

// Online status - will be moved to store
const isOnline = ref(false)

// Mock notifications - will be replaced with Pinia store
const notifications = ref([])

// Computed properties
const userInitials = computed(() => {
  if (!user.value.name) return ''

  const names = user.value.name.split(' ')
  if (names.length === 1) return names[0].charAt(0)

  return names[0].charAt(0) + names[names.length - 1].charAt(0)
})

// Toggle online status
const toggleOnlineStatus = () => {
  // In a real implementation, this would update the status on the server
  console.log(`Driver is now ${isOnline.value ? 'online' : 'offline'}`)
}

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.driver-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.driver-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-img {
  height: 30px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-label {
  font-size: 0.9rem;
  color: #666;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #999;
}

.status-text.online {
  color: #25b847;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
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
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #25b847;
}

input:focus + .slider {
  box-shadow: 0 0 1px #25b847;
}

input:checked + .slider:before {
  transform: translateX(18px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.notification-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1.25rem;
  cursor: pointer;
  position: relative;
  padding: 0.25rem;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #f86906;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.user-avatar img,
.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background-color: #f86906;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.driver-container {
  display: flex;
  flex: 1;
}

.driver-sidebar {
  width: 240px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item i {
  width: 24px;
  margin-right: 0.75rem;
  text-align: center;
}

.nav-item:hover,
.nav-item.router-link-active {
  background-color: #f0f0f0;
  color: #f86906;
  border-left-color: #f86906;
}

.logout-btn {
  margin-top: auto;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
}

.driver-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #ffffff;
}

@media (max-width: 992px) {
  .status-label {
    display: none;
  }
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }

  .driver-container {
    flex-direction: column;
  }

  .driver-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 0.75rem 0;
  }

  .sidebar-nav {
    flex-direction: row;
    justify-content: space-around;
    padding: 0 1rem;
  }

  .nav-item {
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.25rem;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .nav-item i {
    margin-right: 0;
    margin-bottom: 0.25rem;
  }

  .nav-item span {
    font-size: 0.75rem;
  }

  .nav-item:hover,
  .nav-item.router-link-active {
    border-left-color: transparent;
    border-bottom-color: #f86906;
  }
}
</style>
