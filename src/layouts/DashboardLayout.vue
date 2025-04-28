<template>
  <div class="dashboard-layout">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="../assets/logo.png" alt="GetTransfer" class="logo-img">
          </router-link>
        </div>
        <div class="user-actions">
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

    <div class="dashboard-container">
      <aside class="dashboard-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/passenger/dashboard" class="nav-item" exact>
            <i class="fas fa-home" />
            <span>{{ $t('nav.dashboard') }}</span>
          </router-link>
          <router-link to="/passenger/rides" class="nav-item">
            <i class="fas fa-car" />
            <span>{{ $t('nav.rides') }}</span>
          </router-link>
          <router-link to="/transfer/new" class="nav-item">
            <i class="fas fa-plus-circle" />
            <span>{{ $t('nav.newBooking') }}</span>
          </router-link>
          <router-link to="/passenger/profile" class="nav-item">
            <i class="fas fa-user" />
            <span>{{ $t('nav.profile') }}</span>
          </router-link>
          <button @click="logout" class="nav-item logout-btn">
            <i class="fas fa-sign-out-alt" />
            <span>{{ $t('nav.logout') }}</span>
          </button>
        </nav>
      </aside>

      <main class="dashboard-content">
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

// Mock user data - will be replaced with Pinia store
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null
})

// Mock notifications - will be replaced with Pinia store
const notifications = ref([])

// Computed properties
const userInitials = computed(() => {
  if (!user.value.name) return ''

  const names = user.value.name.split(' ')
  if (names.length === 1) return names[0].charAt(0)

  return names[0].charAt(0) + names[names.length - 1].charAt(0)
})

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-header {
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

.dashboard-container {
  display: flex;
  flex: 1;
}

.dashboard-sidebar {
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

.dashboard-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #ffffff;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-sidebar {
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
