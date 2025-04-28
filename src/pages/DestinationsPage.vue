<template>
  <div class="destinations-page">
    <div class="container">
      <div class="destinations-header">
        <h1>{{ $t('destinations.title') }}</h1>
        <p>{{ $t('destinations.subtitle') }}</p>
      </div>

      <div class="destinations-search">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('destinations.searchPlaceholder')"
          >
        </div>
      </div>

      <div class="popular-destinations">
        <h2>{{ $t('destinations.popularDestinations') }}</h2>

        <div class="destinations-grid">
          <div
            v-for="destination in filteredDestinations"
            :key="destination.id"
            class="destination-card"
            @click="selectDestination(destination)"
          >
            <div class="destination-image">
              <img :src="destination.image" :alt="destination.name">
              <div class="destination-overlay">
                <span class="destination-country">{{ destination.country }}</span>
              </div>
            </div>
            <div class="destination-content">
              <h3>{{ destination.name }}</h3>
              <p>{{ destination.description }}</p>
              <div class="destination-services">
                <span
                  v-for="service in destination.services"
                  :key="service"
                  class="service-tag"
                >
                  {{ service }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredDestinations.length === 0" class="no-results">
        <i class="fas fa-map-marked-alt"></i>
        <p>{{ $t('destinations.noResults') }}</p>
      </div>

      <div class="continents-section">
        <h2>{{ $t('destinations.exploreByContinents') }}</h2>

        <div class="continents-tabs">
          <button
            v-for="continent in continents"
            :key="continent.id"
            class="continent-tab"
            :class="{ 'active': selectedContinent === continent.id }"
            @click="selectedContinent = continent.id"
          >
            {{ continent.name }}
          </button>
        </div>

        <div class="countries-grid">
          <div
            v-for="country in continentCountries"
            :key="country.id"
            class="country-card"
          >
            <h3>{{ country.name }}</h3>
            <ul class="cities-list">
              <li v-for="city in country.cities.slice(0, 5)" :key="city">
                <a href="#" @click.prevent="searchByCity(city)">{{ city }}</a>
              </li>
              <li v-if="country.cities.length > 5" class="more-cities">
                <a href="#" @click.prevent="searchByCountry(country.name)">
                  {{ $t('destinations.viewMore') }} ({{ country.cities.length - 5 }})
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="popular-routes">
        <h2>{{ $t('destinations.popularRoutes') }}</h2>

        <div class="routes-list">
          <div v-for="route in popularRoutes" :key="route.id" class="route-card">
            <div class="route-info">
              <div class="route-points">
                <div class="route-from">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ route.from }}</span>
                </div>
                <div class="route-arrow">
                  <i class="fas fa-long-arrow-alt-right"></i>
                </div>
                <div class="route-to">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ route.to }}</span>
                </div>
              </div>
              <div class="route-details">
                <div class="route-distance">
                  <i class="fas fa-road"></i>
                  <span>{{ route.distance }} km</span>
                </div>
                <div class="route-time">
                  <i class="fas fa-clock"></i>
                  <span>{{ route.time }}</span>
                </div>
              </div>
            </div>
            <div class="route-price">
              <span class="price-from">{{ $t('destinations.from') }}</span>
              <span class="price-value">${{ route.price }}</span>
              <button
                class="book-route-btn"
                @click="bookRoute(route)"
              >
                {{ $t('common.book') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

// Search functionality
const searchQuery = ref('')

// Selected continent
const selectedContinent = ref('europe')

// Mock data for destinations
const destinations = [
  {
    id: 1,
    name: 'New York City',
    country: 'United States',
    description: t('destinations.newYorkDesc'),
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3JTIweW9ya3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    services: ['Airport Transfer', 'City Tour', 'Hourly Rental'],
    continent: 'north_america'
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    description: t('destinations.parisDesc'),
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    services: ['Airport Transfer', 'City Tour', 'Wedding Transport'],
    continent: 'europe'
  },
  {
    id: 3,
    name: 'London',
    country: 'United Kingdom',
    description: t('destinations.londonDesc'),
    image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9uZG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    services: ['Airport Transfer', 'Business Transport', 'Hourly Rental'],
    continent: 'europe'
  },
  {
    id: 4,
    name: 'Tokyo',
    country: 'Japan',
    description: t('destinations.tokyoDesc'),
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    services: ['Airport Transfer', 'City Tour', 'Private Driver'],
    continent: 'asia'
  },
  {
    id: 5,
    name: 'Dubai',
    country: 'United Arab Emirates',
    description: t('destinations.dubaiDesc'),
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    services: ['Airport Transfer', 'VIP Service', 'Desert Safari'],
    continent: 'asia'
  },
  {
    id: 6,
    name: 'Rome',
    country: 'Italy',
    description: t('destinations.romeDesc'),
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9tZXxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=600&q=60',
    services: ['Airport Transfer', 'Historical Tour', 'Wedding Transport'],
    continent: 'europe'
  }
]

// Filtered destinations based on search query
const filteredDestinations = computed(() => {
  if (!searchQuery.value) {
    return destinations
  }
  const query = searchQuery.value.toLowerCase()
  return destinations.filter(
    destination =>
      destination.name.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query) ||
      destination.description.toLowerCase().includes(query)
  )
})

// Continents data
const continents = [
  { id: 'europe', name: t('destinations.europe') },
  { id: 'north_america', name: t('destinations.northAmerica') },
  { id: 'asia', name: t('destinations.asia') },
  { id: 'south_america', name: t('destinations.southAmerica') },
  { id: 'africa', name: t('destinations.africa') },
  { id: 'oceania', name: t('destinations.oceania') }
]

// Countries data by continent
const countries = {
  europe: [
    {
      id: 1,
      name: 'France',
      cities: ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Strasbourg']
    },
    {
      id: 2,
      name: 'Italy',
      cities: ['Rome', 'Milan', 'Venice', 'Florence', 'Naples', 'Turin', 'Bologna', 'Palermo']
    },
    {
      id: 3,
      name: 'Spain',
      cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga', 'Bilbao']
    },
    {
      id: 4,
      name: 'United Kingdom',
      cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol']
    }
  ],
  north_america: [
    {
      id: 5,
      name: 'United States',
      cities: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Las Vegas', 'Boston', 'Orlando']
    },
    {
      id: 6,
      name: 'Canada',
      cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Quebec City']
    },
    {
      id: 7,
      name: 'Mexico',
      cities: ['Mexico City', 'Cancun', 'Guadalajara', 'Monterrey', 'Merida']
    }
  ],
  asia: [
    {
      id: 8,
      name: 'Japan',
      cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Sapporo', 'Nara']
    },
    {
      id: 9,
      name: 'Thailand',
      cities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi']
    },
    {
      id: 10,
      name: 'United Arab Emirates',
      cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman']
    }
  ],
  south_america: [
    {
      id: 11,
      name: 'Brazil',
      cities: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador', 'Fortaleza']
    },
    {
      id: 12,
      name: 'Argentina',
      cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Mar del Plata']
    }
  ],
  africa: [
    {
      id: 13,
      name: 'South Africa',
      cities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth']
    },
    {
      id: 14,
      name: 'Egypt',
      cities: ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh']
    }
  ],
  oceania: [
    {
      id: 15,
      name: 'Australia',
      cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast']
    },
    {
      id: 16,
      name: 'New Zealand',
      cities: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown', 'Rotorua']
    }
  ]
}

// Get countries for the selected continent
const continentCountries = computed(() => {
  return countries[selectedContinent.value as keyof typeof countries] || []
})

// Popular routes
const popularRoutes = [
  {
    id: 1,
    from: 'JFK Airport',
    to: 'Manhattan, New York',
    distance: 28,
    time: '45-60 min',
    price: 65
  },
  {
    id: 2,
    from: 'Charles de Gaulle Airport',
    to: 'Paris City Center',
    distance: 34,
    time: '45-60 min',
    price: 75
  },
  {
    id: 3,
    from: 'Heathrow Airport',
    to: 'Central London',
    distance: 24,
    time: '45-60 min',
    price: 85
  },
  {
    id: 4,
    from: 'Dubai International Airport',
    to: 'Dubai Marina',
    distance: 32,
    time: '30-40 min',
    price: 55
  },
  {
    id: 5,
    from: 'Rome Fiumicino Airport',
    to: 'Rome City Center',
    distance: 30,
    time: '45-60 min',
    price: 65
  }
]

// Functions
function selectDestination(destination: any) {
  router.push({
    path: '/transfer/new',
    query: { destination: destination.name }
  })
}

function searchByCity(city: string) {
  searchQuery.value = city
  // Scroll to top to see search results
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function searchByCountry(country: string) {
  searchQuery.value = country
  // Scroll to top to see search results
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function bookRoute(route: any) {
  router.push({
    path: '/transfer/new',
    query: {
      pickup: route.from,
      destination: route.to
    }
  })
}
</script>

<style scoped>
.destinations-page {
  padding: 2rem 0;
}

.destinations-header {
  text-align: center;
  margin-bottom: 2rem;
}

.destinations-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.destinations-header p {
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.destinations-search {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.search-input {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input input {
  width: 100%;
  padding: 1rem 1.5rem 1rem 3rem;
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
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.popular-destinations h2,
.continents-section h2,
.popular-routes h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.destination-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.destination-image {
  height: 200px;
  position: relative;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.destination-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  color: white;
}

.destination-country {
  font-size: 0.9rem;
  font-weight: 500;
}

.destination-content {
  padding: 1.25rem;
}

.destination-content h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.destination-content p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.destination-services {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.service-tag {
  padding: 0.25rem 0.75rem;
  background-color: #f5f5f5;
  border-radius: 50px;
  font-size: 0.8rem;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.continents-section {
  margin-bottom: 3rem;
}

.continents-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.continent-tab {
  padding: 0.75rem 1.25rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continent-tab:hover {
  background-color: #eee;
}

.continent-tab.active {
  background-color: #f86906;
  color: white;
  border-color: #f86906;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.country-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.country-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.cities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cities-list li {
  margin-bottom: 0.5rem;
}

.cities-list li:last-child {
  margin-bottom: 0;
}

.cities-list a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.cities-list a:hover {
  color: #f86906;
}

.more-cities a {
  color: #f86906;
  font-size: 0.9rem;
}

.popular-routes {
  margin-bottom: 3rem;
}

.routes-list {
  display: grid;
  gap: 1rem;
}

.route-card {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.route-info {
  flex: 1;
}

.route-points {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.route-from, .route-to {
  display: flex;
  align-items: center;
}

.route-from i, .route-to i {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.route-from i {
  color: #f86906;
}

.route-to i {
  color: #25b847;
}

.route-arrow {
  margin: 0 0.75rem;
  color: #999;
}

.route-details {
  display: flex;
  gap: 1.5rem;
}

.route-distance, .route-time {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.route-distance i, .route-time i {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.route-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 150px;
}

.price-from {
  font-size: 0.8rem;
  color: #999;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.book-route-btn {
  padding: 0.5rem 1.25rem;
  background-color: #25b847;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.book-route-btn:hover {
  background-color: #1e9e3e;
}

@media (max-width: 992px) {
  .route-card {
    flex-direction: column;
  }

  .route-price {
    align-items: flex-start;
    margin-top: 1rem;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .price-value {
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .continents-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .continent-tab {
    white-space: nowrap;
  }

  .route-points {
    flex-direction: column;
    align-items: flex-start;
  }

  .route-arrow {
    display: none;
  }

  .route-from, .route-to {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .destinations-header h1 {
    font-size: 1.75rem;
  }

  .search-input input {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
  }

  .search-input i {
    left: 1rem;
  }

  .destinations-grid {
    grid-template-columns: 1fr;
  }

  .route-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
