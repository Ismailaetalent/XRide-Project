<template>
  <div class="support-page">
    <div class="container">
      <div class="support-header">
        <h1>{{ $t('support.title') }}</h1>
        <p class="support-subtitle">{{ $t('support.subtitle') }}</p>
      </div>

      <div class="support-content">
        <div class="support-sidebar">
          <div class="contact-info">
            <h2>{{ $t('support.contactUs') }}</h2>
            <div class="contact-method">
              <i class="fas fa-phone"></i>
              <div class="contact-details">
                <h3>{{ $t('support.phone') }}</h3>
                <p>+1-800-GET-RIDE</p>
                <p class="hours">{{ $t('support.workingHours') }}</p>
              </div>
            </div>
            <div class="contact-method">
              <i class="fas fa-envelope"></i>
              <div class="contact-details">
                <h3>{{ $t('support.email') }}</h3>
                <p>support@gettransfer.com</p>
                <p class="hours">{{ $t('support.responseTime') }}</p>
              </div>
            </div>
            <div class="contact-method">
              <i class="fas fa-comment"></i>
              <div class="contact-details">
                <h3>{{ $t('support.chat') }}</h3>
                <p>{{ $t('support.chatDescription') }}</p>
                <button class="start-chat-btn">
                  {{ $t('support.startChat') }}
                </button>
              </div>
            </div>
          </div>

          <div class="support-options">
            <h2>{{ $t('support.helpOptions') }}</h2>
            <div class="support-option-buttons">
              <button class="option-btn active" @click="activeTab = 'contact'">
                <i class="fas fa-envelope"></i>
                {{ $t('support.contactForm') }}
              </button>
              <button class="option-btn" @click="activeTab = 'faq'">
                <i class="fas fa-question-circle"></i>
                {{ $t('support.faq') }}
              </button>
              <button class="option-btn" @click="activeTab = 'booking'">
                <i class="fas fa-search"></i>
                {{ $t('support.findBooking') }}
              </button>
            </div>
          </div>
        </div>

        <div class="support-main">
          <!-- Contact Form -->
          <div v-if="activeTab === 'contact'" class="contact-form">
            <h2>{{ $t('support.getInTouch') }}</h2>
            <p>{{ $t('support.fillOutForm') }}</p>

            <form @submit.prevent="submitContactForm">
              <div class="form-group">
                <label for="name">{{ $t('common.name') }}</label>
                <input
                  id="name"
                  v-model="contactForm.name"
                  type="text"
                  :placeholder="$t('common.name')"
                  required
                >
              </div>

              <div class="form-group">
                <label for="email">{{ $t('common.email') }}</label>
                <input
                  id="email"
                  v-model="contactForm.email"
                  type="email"
                  :placeholder="$t('common.email')"
                  required
                >
              </div>

              <div class="form-group">
                <label for="subject">{{ $t('support.subject') }}</label>
                <select
                  id="subject"
                  v-model="contactForm.subject"
                  required
                >
                  <option value="">{{ $t('support.selectSubject') }}</option>
                  <option value="booking">{{ $t('support.subjectBooking') }}</option>
                  <option value="account">{{ $t('support.subjectAccount') }}</option>
                  <option value="payment">{{ $t('support.subjectPayment') }}</option>
                  <option value="complaint">{{ $t('support.subjectComplaint') }}</option>
                  <option value="feedback">{{ $t('support.subjectFeedback') }}</option>
                  <option value="other">{{ $t('support.subjectOther') }}</option>
                </select>
              </div>

              <div v-if="contactForm.subject === 'booking'" class="form-group">
                <label for="bookingId">{{ $t('support.bookingId') }}</label>
                <input
                  id="bookingId"
                  v-model="contactForm.bookingId"
                  type="text"
                  :placeholder="$t('support.enterBookingId')"
                >
              </div>

              <div class="form-group">
                <label for="message">{{ $t('support.message') }}</label>
                <textarea
                  id="message"
                  v-model="contactForm.message"
                  :placeholder="$t('support.enterMessage')"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div class="form-group attachment">
                <label for="attachment">{{ $t('support.attachFiles') }}</label>
                <div class="file-upload">
                  <label for="attachment" class="file-upload-btn">
                    <i class="fas fa-paperclip"></i>
                    {{ $t('support.chooseFiles') }}
                  </label>
                  <input
                    id="attachment"
                    type="file"
                    @change="handleFileUpload"
                    multiple
                    class="hidden-file-input"
                  >
                  <span class="file-info">{{ fileInfo }}</span>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  <span v-if="isSubmitting">{{ $t('common.loading') }}</span>
                  <span v-else>{{ $t('support.sendMessage') }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- FAQ Section -->
          <div v-if="activeTab === 'faq'" class="faq-section">
            <h2>{{ $t('support.faq') }}</h2>
            <p>{{ $t('support.faqDescription') }}</p>

            <div class="faq-categories">
              <button
                v-for="category in faqCategories"
                :key="category.id"
                class="category-btn"
                :class="{ 'active': activeCategory === category.id }"
                @click="activeCategory = category.id"
              >
                {{ category.name }}
              </button>
            </div>

            <div class="faq-list">
              <div
                v-for="(faq, index) in filteredFaqs"
                :key="index"
                class="faq-item"
                :class="{ 'expanded': expandedFaq === index }"
              >
                <div class="faq-question" @click="toggleFaq(index)">
                  <h3>{{ faq.question }}</h3>
                  <i class="fas" :class="expandedFaq === index ? 'fa-minus' : 'fa-plus'"></i>
                </div>
                <div v-show="expandedFaq === index" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Find Booking Section -->
          <div v-if="activeTab === 'booking'" class="booking-search">
            <h2>{{ $t('support.findBooking') }}</h2>
            <p>{{ $t('support.findBookingDescription') }}</p>

            <form @submit.prevent="searchBooking" class="booking-search-form">
              <div class="form-group">
                <label for="bookingSearch">{{ $t('support.bookingIdEmail') }}</label>
                <div class="search-input">
                  <input
                    id="bookingSearch"
                    v-model="bookingSearch"
                    type="text"
                    :placeholder="$t('support.enterBookingIdOrEmail')"
                    required
                  >
                  <button type="submit" class="search-btn">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </form>

            <div v-if="searchResultMessage" class="search-result">
              <p>{{ searchResultMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Active tab state
const activeTab = ref('contact')

// Contact form
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  bookingId: '',
  message: '',
  files: [] as File[]
})

const isSubmitting = ref(false)
const fileInfo = ref('')

// Handle file upload
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    contactForm.value.files = Array.from(input.files)
    if (contactForm.value.files.length > 0) {
      fileInfo.value = contactForm.value.files.length === 1
        ? contactForm.value.files[0].name
        : `${contactForm.value.files.length} ${t('support.filesSelected')}`
    } else {
      fileInfo.value = ''
    }
  }
}

// Submit contact form
async function submitContactForm() {
  isSubmitting.value = true

  try {
    // In a real app, this would call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Clear the form
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      bookingId: '',
      message: '',
      files: []
    }
    fileInfo.value = ''

    alert(t('support.messageSent'))
  } catch (error) {
    console.error('Error sending message:', error)
    alert(t('errors.somethingWentWrong'))
  } finally {
    isSubmitting.value = false
  }
}

// FAQ section
const activeCategory = ref('all')
const expandedFaq = ref(-1)

const faqCategories = [
  { id: 'all', name: t('support.allTopics') },
  { id: 'booking', name: t('support.bookingProcess') },
  { id: 'payment', name: t('support.payment') },
  { id: 'driver', name: t('support.drivers') },
  { id: 'account', name: t('support.account') }
]

const faqs = [
  {
    category: 'booking',
    question: t('support.faq1Question'),
    answer: t('support.faq1Answer')
  },
  {
    category: 'booking',
    question: t('support.faq2Question'),
    answer: t('support.faq2Answer')
  },
  {
    category: 'payment',
    question: t('support.faq3Question'),
    answer: t('support.faq3Answer')
  },
  {
    category: 'payment',
    question: t('support.faq4Question'),
    answer: t('support.faq4Answer')
  },
  {
    category: 'driver',
    question: t('support.faq5Question'),
    answer: t('support.faq5Answer')
  },
  {
    category: 'driver',
    question: t('support.faq6Question'),
    answer: t('support.faq6Answer')
  },
  {
    category: 'account',
    question: t('support.faq7Question'),
    answer: t('support.faq7Answer')
  },
  {
    category: 'account',
    question: t('support.faq8Question'),
    answer: t('support.faq8Answer')
  }
]

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') {
    return faqs
  }
  return faqs.filter(faq => faq.category === activeCategory.value)
})

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? -1 : index
}

// Booking search
const bookingSearch = ref('')
const searchResultMessage = ref('')

function searchBooking() {
  // In a real app, this would call an API endpoint to search for the booking
  const query = bookingSearch.value.trim()

  if (query.length < 3) {
    searchResultMessage.value = t('support.searchTooShort')
    return
  }

  // Mock search result - in a real app this would be dynamic
  searchResultMessage.value = t('support.noBookingFound')
}
</script>

<style scoped>
.support-page {
  padding: 2rem 0;
}

.support-header {
  text-align: center;
  margin-bottom: 2rem;
}

.support-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.support-subtitle {
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.support-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.support-sidebar,
.support-main {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.support-sidebar {
  padding: 1.5rem;
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-info h2,
.support-options h2 {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  color: #333;
}

.contact-method {
  display: flex;
  margin-bottom: 1.5rem;
}

.contact-method:last-child {
  margin-bottom: 0;
}

.contact-method i {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #f86906;
  font-size: 1.25rem;
}

.contact-details h3 {
  font-size: 1rem;
  margin: 0 0 0.25rem;
  color: #333;
}

.contact-details p {
  margin: 0 0 0.25rem;
  color: #666;
}

.contact-details .hours {
  font-size: 0.8rem;
  color: #999;
}

.start-chat-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.start-chat-btn:hover {
  background-color: #e55c00;
}

.support-option-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-btn {
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-align: left;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.option-btn i {
  margin-right: 0.75rem;
  width: 16px;
  text-align: center;
}

.option-btn:hover {
  background-color: #eee;
}

.option-btn.active {
  background-color: #f86906;
  color: white;
  border-color: #f86906;
}

.support-main {
  padding: 2rem;
}

.contact-form h2,
.faq-section h2,
.booking-search h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #333;
}

.contact-form p,
.faq-section p,
.booking-search p {
  color: #666;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #f86906;
  outline: none;
}

.file-upload {
  display: flex;
  align-items: center;
}

.file-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.hidden-file-input {
  display: none;
}

.file-info {
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: #e55c00;
}

.submit-btn:disabled {
  background-color: #ffccaa;
  cursor: not-allowed;
}

.faq-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.category-btn.active {
  background-color: #f86906;
  color: white;
  border-color: #f86906;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.faq-question {
  padding: 1rem;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question h3 {
  font-size: 1rem;
  margin: 0;
  color: #333;
  font-weight: 500;
}

.faq-question i {
  color: #999;
}

.faq-answer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

.faq-answer p {
  margin: 0;
  color: #666;
}

.faq-item.expanded .faq-question {
  background-color: #f5f5f5;
}

.booking-search-form {
  margin-bottom: 1.5rem;
}

.search-input {
  display: flex;
}

.search-input input {
  flex: 1;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.search-btn {
  padding: 0 1rem;
  background-color: #f86906;
  color: white;
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
}

.search-result {
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;
}

@media (max-width: 992px) {
  .support-content {
    grid-template-columns: 1fr;
  }

  .support-sidebar {
    order: 1;
  }
}

@media (max-width: 768px) {
  .contact-method {
    flex-direction: column;
  }

  .contact-method i {
    margin-bottom: 0.5rem;
    margin-right: 0;
  }

  .faq-categories {
    flex-direction: column;
  }

  .category-btn {
    width: 100%;
    text-align: left;
  }
}
</style>
