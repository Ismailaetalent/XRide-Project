<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-content">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="../assets/logo.png" alt="GetTransfer" class="logo-img">
          </router-link>
        </div>
        <div class="admin-title">
          <h1>{{ $t('admin.adminPanel') }}</h1>
        </div>
        <div class="user-actions">
          <div class="user-menu">
            <span class="user-name">Admin</span>
            <div class="user-avatar">
              <div class="avatar-placeholder">A</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="admin-container">
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/admin/dashboard" class="nav-item" exact>
            <i class="fas fa-tachometer-alt" />
            <span>{{ $t('nav.dashboard') }}</span>
          </router-link>
          <router-link to="/admin/users" class="nav-item">
            <i class="fas fa-users" />
            <span>{{ $t('admin.users') }}</span>
          </router-link>
          <router-link to="/admin/drivers" class="nav-item">
            <i class="fas fa-id-card" />
            <span>{{ $t('admin.drivers') }}</span>
          </router-link>
          <router-link to="/admin/rides" class="nav-item">
            <i class="fas fa-car" />
            <span>{{ $t('admin.rides') }}</span>
          </router-link>
          <router-link to="/admin/payments" class="nav-item">
            <i class="fas fa-money-bill" />
            <span>{{ $t('admin.payments') }}</span>
          </router-link>
          <router-link to="/admin/settings" class="nav-item">
            <i class="fas fa-cog" />
            <span>{{ $t('admin.settings') }}</span>
          </router-link>
          <button @click="logout" class="nav-item logout-btn">
            <i class="fas fa-sign-out-alt" />
            <span>{{ $t('nav.logout') }}</span>
          </button>
        </nav>
      </aside>

      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

useI18n()
const router = useRouter()

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  background-color: #222021;
  color: white;
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

.admin-title h1 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 500;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.user-name {
  font-weight: 500;
  color: white;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f86906;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.admin-container {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 240px;
  background-color: #2a2a2a;
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
  color: #ccc;
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
  background-color: #333;
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

.admin-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .admin-title {
    display: none;
  }

  .admin-container {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    padding: 0.75rem 0;
  }

  .sidebar-nav {
    flex-direction: row;
    justify-content: space-around;
    padding: 0 1rem;
    overflow-x: auto;
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
