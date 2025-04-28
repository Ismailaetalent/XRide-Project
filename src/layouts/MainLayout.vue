<template>
  <div class="layout-container">
    <header class="header" :class="{ 'scrolled': scrolled }">
      <div class="header-content">
        <div class="logo-wrapper">
          <router-link to="/" class="logo">
            <img src="../assets/logo.png" alt="GetTransfer" class="logo-img">
          </router-link>
        </div>
        <div class="navigation-wrapper">
          <nav class="navigation">
            <ul class="nav-links">
              <li>
                <router-link to="/support">{{ $t('nav.support') }}</router-link>
              </li>
              <li>
                <router-link to="/destinations">{{ $t('nav.destinations') }}</router-link>
              </li>
              <li>
                <router-link to="/driver">{{ $t('nav.forDrivers') }}</router-link>
              </li>
              <li>
                <router-link to="/business">{{ $t('nav.forBusiness') }}</router-link>
              </li>
              <li>
                <router-link to="/agents">{{ $t('nav.forAgents') }}</router-link>
              </li>
              <li>
                <router-link to="/feedback">{{ $t('nav.feedback') }}</router-link>
              </li>
              <li>
                <a href="https://blog.gettransfer.com" target="_blank">{{ $t('nav.blog') }}</a>
              </li>
              <li>
                <router-link to="/faq">{{ $t('nav.faq') }}</router-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="user-actions">
          <select v-model="currentCurrency" class="selector">
            <option value="USD">US$</option>
            <option value="EUR">€</option>
            <option value="GBP">£</option>
            <option value="RUB">₽</option>
          </select>
          <select v-model="currentUnit" class="selector">
            <option value="km">km</option>
            <option value="mi">mi</option>
          </select>
          <select v-model="$i18n.locale" class="selector">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
            <option value="ru">RU</option>
          </select>
          <div class="auth-buttons">
            <template v-if="!isAuthenticated">
              <router-link to="/auth/login" class="login-button">
                {{ $t('common.login') }}
              </router-link>
            </template>
            <template v-else>
              <router-link to="/passenger/dashboard" class="dashboard-link">
                {{ $t('nav.rides') }}
              </router-link>
              <button @click="logout" class="logout-button">
                {{ $t('nav.logout') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>{{ $t('nav.services') }}</h3>
          <ul>
            <li><router-link to="/services/airport-transfer">{{ $t('services.airportTransfer') }}</router-link></li>
            <li><router-link to="/services/vip-transfer">{{ $t('services.vipTransfer') }}</router-link></li>
            <li><router-link to="/services/bus-rental">{{ $t('services.busRental') }}</router-link></li>
            <li><a href="#">{{ $t('services.carRental') }}</a></li>
            <li><a href="#">{{ $t('services.yachtCharter') }}</a></li>
            <li><a href="#">{{ $t('services.experiencesNearMe') }}</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>{{ $t('nav.sitemap') }}</h3>
          <ul>
            <li><router-link to="/support">{{ $t('nav.support') }}</router-link></li>
            <li><router-link to="/destinations">{{ $t('nav.destinations') }}</router-link></li>
            <li><router-link to="/driver">{{ $t('nav.forDrivers') }}</router-link></li>
            <li><router-link to="/business">{{ $t('nav.forBusiness') }}</router-link></li>
            <li><router-link to="/agents">{{ $t('nav.forAgents') }}</router-link></li>
            <li><router-link to="/feedback">{{ $t('nav.feedback') }}</router-link></li>
            <li><a href="https://blog.gettransfer.com" target="_blank">{{ $t('nav.blog') }}</a></li>
            <li><router-link to="/faq">{{ $t('nav.faq') }}</router-link></li>
            <li><router-link to="/terms">{{ $t('footer.serviceAgreement') }}</router-link></li>
            <li><router-link to="/privacy">{{ $t('footer.privacyPolicy') }}</router-link></li>
          </ul>
        </div>
        <div class="footer-section address-section">
          <h3>{{ $t('footer.address') }}</h3>
          <address>
            <p>GetTransfer LTD</p>
            <p>57 Spyrou Kyprianou, Bybloserve Business Center, 2nd Floor, 6051, Larnaca, Cyprus</p>
          </address>
          <address>
            <p>Globalrides LTD</p>
            <p>5 Vyzantiou Street, Spyrides Tower, Strovolos, 2064, Nicosia, Cyprus</p>
          </address>
        </div>
        <div class="footer-section app-section">
          <h3>{{ $t('footer.getTheApp') }}</h3>
          <div class="qr-code">
            <div style="width: 120px; height: 120px; background-color: #eee; display: flex; align-items: center; justify-content: center;">
              <span>QR Code</span>
            </div>
          </div>
          <div class="app-buttons">
            <a href="#" class="app-button">
              <div style="height: 40px; background-color: #eee; display: flex; align-items: center; justify-content: center; padding: 0 10px;">App Store</div>
            </a>
            <a href="#" class="app-button">
              <div style="height: 40px; background-color: #eee; display: flex; align-items: center; justify-content: center; padding: 0 10px;">Google Play</div>
            </a>
            <a href="#" class="app-button">
              <div style="height: 40px; background-color: #eee; display: flex; align-items: center; justify-content: center; padding: 0 10px;">App Gallery</div>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© GetTransfer ltd. GetTransfer is trademark of GetTransfer ltd. All rights reserved.</p>
        <div class="social-links">
          <a href="#" class="social-link"><i class="fab fa-twitter" /></a>
          <a href="#" class="social-link"><i class="fab fa-facebook" /></a>
          <a href="#" class="social-link"><i class="fab fa-instagram" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const router = useRouter()

// Authentication state (will be replaced with Pinia store)
const isAuthenticated = ref(!!localStorage.getItem('token'))

// Locale & Currency
const currentCurrency = ref(localStorage.getItem('currency') || 'USD')
const currentUnit = ref(localStorage.getItem('unit') || 'km')

// Scroll state for header
const scrolled = ref(false)

const checkScroll = () => {
  scrolled.value = window.scrollY > 0
}

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  router.push('/')
}

// Watchers for user preferences
watch(currentCurrency, (value) => {
  localStorage.setItem('currency', value)
})

watch(currentUnit, (value) => {
  localStorage.setItem('unit', value)
})

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #f86906;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.header.scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrapper {
  flex: 0 0 auto;
}

.logo-img {
  height: 30px;
}

.navigation-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 0;
}

.nav-links a:hover {
  text-decoration: underline;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selector {
  background-color: transparent;
  color: white;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem;
  appearance: none;
}

.selector option {
  background-color: white;
  color: black;
}

.auth-buttons {
  margin-left: 1rem;
  display: flex;
  gap: 1rem;
}

.login-button, .dashboard-link, .logout-button {
  background: none;
  border: none;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.login-button:hover, .dashboard-link:hover, .logout-button:hover {
  text-decoration: underline;
}

.main-content {
  flex: 1;
}

.footer {
  background-color: #f7f7f7;
  padding: 2rem 0;
  font-size: 0.9rem;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #666;
  text-decoration: none;
}

.footer-section a:hover {
  color: #f86906;
}

.address-section address {
  margin-bottom: 1rem;
  font-style: normal;
  color: #666;
}

.app-section {
  display: flex;
  flex-direction: column;
}

.qr-code img {
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
}

.app-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-button img {
  height: 40px;
}

.footer-bottom {
  max-width: 1280px;
  margin: 2rem auto 0;
  padding: 1.5rem 1rem 0;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #888;
  font-size: 1.2rem;
}

.social-link:hover {
  color: #f86906;
}

@media (max-width: 992px) {
  .navigation-wrapper {
    display: none;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .user-actions {
    flex-wrap: wrap;
  }
}
</style>
