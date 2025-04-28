<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="not-found-header">
        <h1>404</h1>
        <h2>{{ $t('notFound.title') }}</h2>
      </div>
      <p>{{ $t('notFound.description') }}</p>
      <div class="not-found-actions">
        <router-link to="/" class="home-button">
          <i class="fas fa-home" />
          {{ $t('notFound.goHome') }}
        </router-link>
        <button class="back-button" @click="goBack">
          <i class="fas fa-arrow-left" />
          {{ $t('notFound.goBack') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

useI18n()
const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: #f7f7f7;
}

.not-found-content {
  max-width: 600px;
  text-align: center;
  background-color: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.not-found-header {
  margin-bottom: 2rem;
}

.not-found-header h1 {
  font-size: 6rem;
  font-weight: 700;
  color: #f86906;
  line-height: 1;
  margin: 0;
}

.not-found-header h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0.5rem 0 0;
  color: #333;
}

.not-found-content p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.not-found-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.home-button,
.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.home-button {
  background-color: #f86906;
  color: white;
  border: none;
}

.home-button:hover {
  background-color: #e55c00;
}

.back-button {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.back-button:hover {
  background-color: #f0f0f0;
}

@media (max-width: 576px) {
  .not-found-content {
    padding: 2rem 1rem;
  }

  .not-found-header h1 {
    font-size: 4rem;
  }

  .not-found-header h2 {
    font-size: 1.25rem;
  }

  .not-found-actions {
    flex-direction: column;
  }
}
</style>
