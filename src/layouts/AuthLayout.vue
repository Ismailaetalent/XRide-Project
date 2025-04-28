<template>
  <div class="auth-layout">
    <div class="auth-header">
      <router-link to="/" class="auth-logo">
        <img src="../assets/logo.png" alt="GetTransfer" class="logo-img">
      </router-link>
    </div>

    <div class="auth-content">
      <div class="auth-card">
        <router-view />
      </div>
    </div>

    <div class="auth-footer">
      <p>© GetTransfer ltd. GetTransfer is trademark of GetTransfer ltd.</p>
      <div class="language-selector">
        <select v-model="$i18n.locale" class="selector">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ru">Русский</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.auth-header {
  background-color: #f86906;
  padding: 1rem;
  text-align: center;
}

.logo-img {
  height: 30px;
}

.auth-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.auth-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  padding: 2rem;
}

.auth-footer {
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.language-selector {
  display: flex;
  align-items: center;
  justify-content: center;
}

.selector {
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
}

@media (max-width: 576px) {
  .auth-card {
    padding: 1.5rem;
  }
}
</style>
