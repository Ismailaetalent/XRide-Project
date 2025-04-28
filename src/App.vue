<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/useAuthStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Watch for route changes to update page title
watch(
  () => route.path,
  () => {
    // Set page title based on route
    const routeName = route.name as string || 'home'
    document.title = `GetTransfer - ${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`
  }
)

// Check authentication status on app mount
onMounted(() => {
  // Check token expiration (in a real app this would verify with the backend)
  const token = localStorage.getItem('token')
  if (token) {
    // Mock token validation
    const isValid = true

    if (!isValid) {
      authStore.logout()
      router.push('/auth/login')
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
  --primary-color: #f86906;
  --secondary-color: #25b847;
  --dark-color: #222021;
  --light-color: #f8f9fa;
  --gray-color: #6c757d;
  --light-gray-color: #e9ecef;
  --white-color: #ffffff;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --success-color: #28a745;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--dark-color);
  background-color: var(--white-color);
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0 0 1rem;
  font-weight: 500;
  line-height: 1.2;
}

p {
  margin: 0 0 1rem;
}

button {
  cursor: pointer;
  font-family: inherit;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.text-center {
  text-align: center;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-5 {
  margin-bottom: 3rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mt-5 {
  margin-top: 3rem;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.justify-content-center {
  justify-content: center;
}

.flex-column {
  flex-direction: column;
}

.w-100 {
  width: 100%;
}

.text-primary {
  color: var(--primary-color);
}

.text-secondary {
  color: var(--secondary-color);
}

.text-dark {
  color: var(--dark-color);
}

.text-light {
  color: var(--gray-color);
}

.bg-primary {
  background-color: var(--primary-color);
}

.bg-light {
  background-color: var(--light-color);
}

@media (max-width: 992px) {
  body {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.75rem;
  }
}

@media (max-width: 576px) {
  body {
    font-size: 14px;
  }

  .container {
    padding: 0 0.5rem;
  }
}
</style>
