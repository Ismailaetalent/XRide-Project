<template>
  <div class="faq-page">
    <div class="container">
      <div class="faq-header">
        <h1>{{ $t('faq.title') }}</h1>
        <p class="faq-subtitle">{{ $t('faq.subtitle') }}</p>
      </div>

      <div class="search-section">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('faq.searchPlaceholder')"
          >
        </div>
      </div>

      <div class="faq-content">
        <div class="faq-sidebar">
          <div class="categories">
            <h2>{{ $t('faq.categories') }}</h2>
            <ul class="category-list">
              <li
                v-for="category in faqCategories"
                :key="category.id"
                :class="{ 'active': activeCategory === category.id }"
              >
                <a
                  href="#"
                  @click.prevent="activeCategory = category.id"
                >
                  <i :class="category.icon"></i>
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>

          <div class="need-help">
            <h2>{{ $t('faq.needMoreHelp') }}</h2>
            <p>{{ $t('faq.contactUsText') }}</p>
            <a href="/support" class="contact-link">
              <i class="fas fa-headset"></i>
              {{ $t('faq.contactSupport') }}
            </a>
          </div>
        </div>

        <div class="faq-main">
          <div v-if="searchQuery" class="search-results">
            <h2>
              {{ $t('faq.searchResults') }}: "{{ searchQuery }}"
              <button class="clear-search" @click="searchQuery = ''">
                <i class="fas fa-times"></i>
              </button>
            </h2>

            <div v-if="filteredFaqs.length === 0" class="empty-results">
              <i class="fas fa-search"></i>
              <p>{{ $t('faq.noResults') }}</p>
            </div>
          </div>

          <div v-else class="category-header">
            <h2>{{ activeCategoryName }}</h2>
            <p>{{ activeCategoryDescription }}</p>
          </div>

          <div class="faq-accordion">
            <div
              v-for="(faq, index) in displayedFaqs"
              :key="index"
              class="faq-item"
              :class="{ 'expanded': expandedFaq === index }"
            >
              <div class="faq-question" @click="toggleFaq(index)">
                <h3>{{ faq.question }}</h3>
                <i class="fas" :class="expandedFaq === index ? 'fa-minus' : 'fa-plus'"></i>
              </div>
              <div v-show="expandedFaq === index" class="faq-answer">
                <div v-html="faq.answer"></div>
                <div v-if="faq.related && faq.related.length > 0" class="related-questions">
                  <h4>{{ $t('faq.relatedQuestions') }}</h4>
                  <ul>
                    <li v-for="(related, rIndex) in faq.related" :key="rIndex">
                      <a href="#" @click.prevent="navigateToQuestion(related.id)">
                        {{ related.question }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!searchQuery && displayedFaqs.length > 5" class="faq-pagination">
            <button
              class="pagination-btn prev"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <i class="fas fa-chevron-left"></i>
              {{ $t('faq.previous') }}
            </button>
            <div class="page-indicator">
              {{ $t('faq.page') }} {{ currentPage }} {{ $t('faq.of') }} {{ totalPages }}
            </div>
            <button
              class="pagination-btn next"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              {{ $t('faq.next') }}
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// State
const searchQuery = ref('')
const activeCategory = ref('general')
const expandedFaq = ref(-1)
const currentPage = ref(1)
const itemsPerPage = 8

// FAQ Categories
const faqCategories = [
  {
    id: 'general',
    name: t('faq.general'),
    icon: 'fas fa-info-circle',
    description: t('faq.generalDesc')
  },
  {
    id: 'booking',
    name: t('faq.booking'),
    icon: 'fas fa-calendar-check',
    description: t('faq.bookingDesc')
  },
  {
    id: 'payment',
    name: t('faq.payment'),
    icon: 'fas fa-credit-card',
    description: t('faq.paymentDesc')
  },
  {
    id: 'services',
    name: t('faq.services'),
    icon: 'fas fa-concierge-bell',
    description: t('faq.servicesDesc')
  },
  {
    id: 'drivers',
    name: t('faq.drivers'),
    icon: 'fas fa-user',
    description: t('faq.driversDesc')
  },
  {
    id: 'account',
    name: t('faq.account'),
    icon: 'fas fa-user-circle',
    description: t('faq.accountDesc')
  }
]

// FAQ Data
const faqData = [
  {
    id: 'general-1',
    category: 'general',
    question: t('faq.question1'),
    answer: t('faq.answer1'),
    related: [
      { id: 'booking-1', question: t('faq.question5') },
      { id: 'services-1', question: t('faq.question13') }
    ]
  },
  {
    id: 'general-2',
    category: 'general',
    question: t('faq.question2'),
    answer: t('faq.answer2')
  },
  {
    id: 'general-3',
    category: 'general',
    question: t('faq.question3'),
    answer: t('faq.answer3')
  },
  {
    id: 'general-4',
    category: 'general',
    question: t('faq.question4'),
    answer: t('faq.answer4')
  },
  {
    id: 'booking-1',
    category: 'booking',
    question: t('faq.question5'),
    answer: t('faq.answer5')
  },
  {
    id: 'booking-2',
    category: 'booking',
    question: t('faq.question6'),
    answer: t('faq.answer6')
  },
  {
    id: 'booking-3',
    category: 'booking',
    question: t('faq.question7'),
    answer: t('faq.answer7')
  },
  {
    id: 'booking-4',
    category: 'booking',
    question: t('faq.question8'),
    answer: t('faq.answer8')
  },
  {
    id: 'payment-1',
    category: 'payment',
    question: t('faq.question9'),
    answer: t('faq.answer9')
  },
  {
    id: 'payment-2',
    category: 'payment',
    question: t('faq.question10'),
    answer: t('faq.answer10')
  },
  {
    id: 'payment-3',
    category: 'payment',
    question: t('faq.question11'),
    answer: t('faq.answer11')
  },
  {
    id: 'payment-4',
    category: 'payment',
    question: t('faq.question12'),
    answer: t('faq.answer12')
  },
  {
    id: 'services-1',
    category: 'services',
    question: t('faq.question13'),
    answer: t('faq.answer13')
  },
  {
    id: 'services-2',
    category: 'services',
    question: t('faq.question14'),
    answer: t('faq.answer14')
  },
  {
    id: 'services-3',
    category: 'services',
    question: t('faq.question15'),
    answer: t('faq.answer15')
  },
  {
    id: 'services-4',
    category: 'services',
    question: t('faq.question16'),
    answer: t('faq.answer16')
  },
  {
    id: 'drivers-1',
    category: 'drivers',
    question: t('faq.question17'),
    answer: t('faq.answer17')
  },
  {
    id: 'drivers-2',
    category: 'drivers',
    question: t('faq.question18'),
    answer: t('faq.answer18')
  },
  {
    id: 'drivers-3',
    category: 'drivers',
    question: t('faq.question19'),
    answer: t('faq.answer19')
  },
  {
    id: 'account-1',
    category: 'account',
    question: t('faq.question20'),
    answer: t('faq.answer20')
  },
  {
    id: 'account-2',
    category: 'account',
    question: t('faq.question21'),
    answer: t('faq.answer21')
  },
  {
    id: 'account-3',
    category: 'account',
    question: t('faq.question22'),
    answer: t('faq.answer22')
  }
]

// Get active category name
const activeCategoryName = computed(() => {
  const category = faqCategories.find(cat => cat.id === activeCategory.value)
  return category ? category.name : ''
})

// Get active category description
const activeCategoryDescription = computed(() => {
  const category = faqCategories.find(cat => cat.id === activeCategory.value)
  return category ? category.description : ''
})

// Filter FAQs by search query or active category
const filteredFaqs = computed(() => {
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    return faqData.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  } else {
    return faqData.filter(faq => faq.category === activeCategory.value)
  }
})

// Paginate FAQs
const totalPages = computed(() => {
  return Math.ceil(filteredFaqs.value.length / itemsPerPage)
})

// Get displayed FAQs for current page
const displayedFaqs = computed(() => {
  if (searchQuery.value) return filteredFaqs.value

  const startIndex = (currentPage.value - 1) * itemsPerPage
  return filteredFaqs.value.slice(startIndex, startIndex + itemsPerPage)
})

// Reset pagination when category or search changes
watch([activeCategory, searchQuery], () => {
  currentPage.value = 1
  expandedFaq.value = -1
})

// Toggle FAQ expansion
function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? -1 : index
}

// Navigate to a specific question
function navigateToQuestion(id: string) {
  const faq = faqData.find(f => f.id === id)
  if (faq) {
    activeCategory.value = faq.category
    searchQuery.value = ''

    // Wait for the displayedFaqs to update
    setTimeout(() => {
      const index = displayedFaqs.value.findIndex(f => f.id === id)
      if (index !== -1) {
        expandedFaq.value = index

        // Scroll to the question
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 100)
  }
}
</script>

<style scoped>
.faq-page {
  padding: 2rem 0;
}

.faq-header {
  text-align: center;
  margin-bottom: 2rem;
}

.faq-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.faq-subtitle {
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.search-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.search-input {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-input input:focus {
  outline: none;
  border-color: #f86906;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.faq-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.faq-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.categories h2,
.need-help h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  margin-bottom: 0.5rem;
}

.category-list a {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.category-list a i {
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
}

.category-list li.active a {
  background-color: #f86906;
  color: white;
}

.category-list li:not(.active) a:hover {
  background-color: #f5f5f5;
}

.need-help {
  background-color: #f9f9f9;
  padding: 1.25rem;
  border-radius: 8px;
}

.need-help p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.contact-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f86906;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.contact-link i {
  margin-right: 0.5rem;
}

.faq-main {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.category-header,
.search-results {
  margin-bottom: 1.5rem;
}

.category-header h2,
.search-results h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.clear-search {
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.9rem;
}

.category-header p {
  color: #666;
}

.empty-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.faq-accordion {
  margin-bottom: 1.5rem;
}

.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-question {
  padding: 1.25rem;
  background-color: #f9f9f9;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h3 {
  font-size: 1rem;
  margin: 0;
  color: #333;
  font-weight: 500;
}

.faq-question i {
  color: #999;
  font-size: 0.9rem;
}

.faq-answer {
  padding: 1.25rem;
  border-top: 1px solid #e0e0e0;
  color: #666;
  line-height: 1.6;
}

.faq-answer p {
  margin-bottom: 1rem;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

.related-questions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.related-questions h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.related-questions ul {
  padding-left: 1.5rem;
}

.related-questions li {
  margin-bottom: 0.5rem;
}

.related-questions a {
  color: #f86906;
  text-decoration: none;
}

.related-questions a:hover {
  text-decoration: underline;
}

.faq-item.expanded .faq-question {
  background-color: #fff3e9;
}

.faq-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.prev i {
  margin-right: 0.5rem;
}

.pagination-btn.next i {
  margin-left: 0.5rem;
}

.page-indicator {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 992px) {
  .faq-content {
    grid-template-columns: 1fr;
  }

  .faq-sidebar {
    grid-row: 2;
    flex-direction: row;
  }

  .categories,
  .need-help {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .faq-sidebar {
    flex-direction: column;
  }

  .faq-question h3 {
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .faq-header h1 {
    font-size: 1.75rem;
  }

  .search-input input {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
  }

  .faq-pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
