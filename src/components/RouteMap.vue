<template>
  <div class="route-map-component">
    <h2>{{ $t('booking.routeMap') }}</h2>

    <div class="map-search">
      <div class="input-with-icon">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('booking.searchLocation')"
          @focus="showSearchSuggestions = true"
          @input="searchLocations"
        >
        <button
          v-if="searchQuery"
          class="clear-search"
          @click="clearSearch"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Location search suggestions -->
      <div class="location-suggestions" v-if="showSearchSuggestions && searchSuggestions.length > 0">
        <div
          v-for="suggestion in searchSuggestions"
          :key="suggestion.id"
          class="suggestion-item"
          @click="selectSearchLocation(suggestion)"
        >
          <div class="suggestion-text">{{ suggestion.text }}</div>
          <div class="suggestion-description">{{ suggestion.description }}</div>
        </div>
      </div>
    </div>

    <div class="map-controls">
      <button
        class="map-control-btn"
        :class="{ 'active': selectMode === 'pickup' }"
        @click="setSelectMode('pickup')"
      >
        <i class="fas fa-map-marker-alt icon-start"></i>
        {{ $t('common.from') }}
      </button>
      <button
        class="map-control-btn"
        :class="{ 'active': selectMode === 'destination' }"
        @click="setSelectMode('destination')"
      >
        <i class="fas fa-map-marker-alt icon-end"></i>
        {{ $t('common.to') }}
      </button>
    </div>

    <div class="map-instructions" v-if="selectMode">
      <i class="fas fa-info-circle"></i>
      <span v-if="selectMode === 'pickup'">{{ $t('booking.pickupMapInstructions') }}</span>
      <span v-else-if="selectMode === 'destination'">{{ $t('booking.destinationMapInstructions') }}</span>
    </div>

    <div id="routeMap" ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useBookingStore } from '../stores/useBookingStore'
import locationService from '../services/location.service'
import { useI18n } from 'vue-i18n'

// Import leaflet after mounted to avoid SSR issues
let L: any

// Setup i18n
const { t } = useI18n()

// Initialize Booking Store
const bookingStore = useBookingStore()

// References
const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = ref<any>(null)
const pickupMarker = ref<any>(null)
const destinationMarker = ref<any>(null)
const routeControl = ref<any>(null)
const selectMode = ref<'pickup' | 'destination' | null>('pickup')

// Search functionality
const searchQuery = ref<string>('')
const searchSuggestions = ref<any[]>([])
const showSearchSuggestions = ref<boolean>(false)
let searchTimer: number | null = null

// Wait for the component to be mounted before initializing the map
onMounted(async () => {
  // Dynamically import Leaflet
  try {
    L = await import('leaflet')
    await import('leaflet-routing-machine')

    // Initialize map if container exists
    if (mapContainer.value) {
      initMap()
    }
  } catch (error) {
    console.error('Failed to load Leaflet:', error)
  }
})

onUnmounted(() => {
  // Clean up map instance when component is destroyed
  if (mapInstance.value) {
    mapInstance.value.remove()
  }
})

// Initialize the map
async function initMap() {
  if (!mapContainer.value || !L) return

  // Default view is London, but we'll try to update it with user's location
  mapInstance.value = L.map(mapContainer.value).setView([51.505, -0.09], 13)

  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance.value)

  // Add click handler to map for placing markers
  mapInstance.value.on('click', handleMapClick)

  // Try to get user's location and center map
  try {
    const userLocation = await locationService.detectUserLocation()
    if (userLocation.detected && userLocation.lat && userLocation.lng) {
      // Center map on user's location
      mapInstance.value.setView([userLocation.lat, userLocation.lng], 14)

      // Only set pickup location if not already set
      if (!bookingStore.pickup.lat || !bookingStore.pickup.lng) {
        bookingStore.setPickupCoordinates(userLocation.lat, userLocation.lng)
        const location = await locationService.reverseGeocode(userLocation.lat, userLocation.lng)
        if (location) {
          bookingStore.setPickup(location.address)
        }
      }
    }
  } catch (error) {
    console.error('Error getting user location:', error)
  }

  // Initialize markers if coordinates exist
  updateMapMarkers()

  // Setup click outside for search suggestions
  setupSearchClickOutsideListener()
}

// Set the selection mode
function setSelectMode(mode: 'pickup' | 'destination') {
  selectMode.value = mode
}

// Handle map clicks based on selection mode
function handleMapClick(e: any) {
  const { lat, lng } = e.latlng

  if (selectMode.value === 'pickup') {
    bookingStore.setPickupCoordinates(lat, lng)
    reverseGeocodePickup(lat, lng)
  } else if (selectMode.value === 'destination') {
    bookingStore.setDestinationCoordinates(lat, lng)
    reverseGeocodeDestination(lat, lng)
  }

  updateMapMarkers()
  updateMapRoute()
}

// Search for locations
async function searchLocations() {
  // Clear previous timer
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  // Debounce search
  searchTimer = setTimeout(async () => {
    try {
      const query = searchQuery.value
      if (query.length < 2) {
        searchSuggestions.value = []
        return
      }

      const suggestions = await locationService.searchLocationSuggestions(query)
      searchSuggestions.value = suggestions
    } catch (error) {
      console.error('Error searching locations:', error)
      searchSuggestions.value = []
    }
  }, 300) as unknown as number
}

// Select a location from search suggestions
function selectSearchLocation(suggestion: any) {
  // Center map on the selected location
  if (suggestion.lat && suggestion.lng) {
    // Center the map on the selected location
    mapInstance.value.setView([suggestion.lat, suggestion.lng], 15)

    // If in selection mode, also set the marker at this location
    if (selectMode.value === 'pickup') {
      bookingStore.setPickup(suggestion.text)
      bookingStore.setPickupCoordinates(suggestion.lat, suggestion.lng)
      updateMapMarkers()
      updateMapRoute()
    } else if (selectMode.value === 'destination') {
      bookingStore.setDestination(suggestion.text)
      bookingStore.setDestinationCoordinates(suggestion.lat, suggestion.lng)
      updateMapMarkers()
      updateMapRoute()
    }
  }

  // Clear search
  clearSearch()
}

// Clear search query and suggestions
function clearSearch() {
  searchQuery.value = ''
  searchSuggestions.value = []
  showSearchSuggestions.value = false
}

// Setup click outside listener for search suggestions
function setupSearchClickOutsideListener() {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Element
    const searchContainer = document.querySelector('.map-search')

    if (searchContainer && !searchContainer.contains(target)) {
      showSearchSuggestions.value = false
    }
  })
}

// Reverse geocode pickup coordinates to address
async function reverseGeocodePickup(lat: number, lng: number) {
  try {
    const location = await locationService.reverseGeocode(lat, lng)
    if (location) {
      bookingStore.setPickup(location.address)
    }
  } catch (error) {
    console.error('Error reverse geocoding pickup:', error)
  }
}

// Reverse geocode destination coordinates to address
async function reverseGeocodeDestination(lat: number, lng: number) {
  try {
    const location = await locationService.reverseGeocode(lat, lng)
    if (location) {
      bookingStore.setDestination(location.address)
    }
  } catch (error) {
    console.error('Error reverse geocoding destination:', error)
  }
}

// Create a pickup marker
function createPickupMarker(lat: number, lng: number) {
  if (!mapInstance.value) return null

  // Create a custom icon with pulse effect
  const pickupIcon = L.divIcon({
    className: 'map-marker-start',
    html: `
      <i class="fas fa-map-marker-alt icon-start"></i>
      <div class="marker-pulse"></div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44]
  })

  // Create the marker with draggable option
  const marker = L.marker([lat, lng], {
    icon: pickupIcon,
    draggable: true,
    autoPan: true
  }).addTo(mapInstance.value)

  // Add drag start event for visual feedback
  marker.on('dragstart', function() {
    const markerElement = marker.getElement()
    if (markerElement) {
      markerElement.classList.add('dragging-marker')
    }
  })

  // Add drag end event to reset visual state and update location
  marker.on('dragend', function() {
    const markerElement = marker.getElement()
    if (markerElement) {
      markerElement.classList.remove('dragging-marker')
    }

    const position = marker.getLatLng()
    bookingStore.setPickupCoordinates(position.lat, position.lng)

    // Update address via reverse geocoding
    reverseGeocodePickup(position.lat, position.lng)

    // Update route
    updateMapRoute()
  })

  return marker
}

// Create a destination marker
function createDestinationMarker(lat: number, lng: number) {
  if (!mapInstance.value) return null

  // Create a custom icon with pulse effect
  const destinationIcon = L.divIcon({
    className: 'map-marker-end',
    html: `
      <i class="fas fa-map-marker-alt icon-end"></i>
      <div class="marker-pulse marker-pulse-end"></div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44]
  })

  // Create the marker with draggable option
  const marker = L.marker([lat, lng], {
    icon: destinationIcon,
    draggable: true,
    autoPan: true
  }).addTo(mapInstance.value)

  // Add drag start event for visual feedback
  marker.on('dragstart', function() {
    const markerElement = marker.getElement()
    if (markerElement) {
      markerElement.classList.add('dragging-marker')
    }
  })

  // Add drag end event to reset visual state and update location
  marker.on('dragend', function() {
    const markerElement = marker.getElement()
    if (markerElement) {
      markerElement.classList.remove('dragging-marker')
    }

    const position = marker.getLatLng()
    bookingStore.setDestinationCoordinates(position.lat, position.lng)

    // Update address via reverse geocoding
    reverseGeocodeDestination(position.lat, position.lng)

    // Update route
    updateMapRoute()
  })

  return marker
}

// Update map markers based on current coordinates
function updateMapMarkers() {
  if (!mapInstance.value || !L) return

  const map = mapInstance.value
  const pickup = bookingStore.pickup
  const destination = bookingStore.destination

  // Update pickup marker if we have coordinates
  if (pickup.lat && pickup.lng) {
    // Clear old marker if exists
    if (pickupMarker.value) {
      map.removeLayer(pickupMarker.value)
    }

    // Create new marker
    pickupMarker.value = createPickupMarker(pickup.lat, pickup.lng)
  }

  // Update destination marker if we have coordinates
  if (destination.lat && destination.lng) {
    // Clear old marker if exists
    if (destinationMarker.value) {
      map.removeLayer(destinationMarker.value)
    }

    // Create new marker
    destinationMarker.value = createDestinationMarker(destination.lat, destination.lng)
  }

  // Fit bounds to show both markers if both exist
  if (pickup.lat && pickup.lng && destination.lat && destination.lng) {
    const bounds = L.latLngBounds([
      [pickup.lat, pickup.lng],
      [destination.lat, destination.lng]
    ])
    map.fitBounds(bounds, { padding: [50, 50] })
  } else if (pickup.lat && pickup.lng) {
    // Center on pickup
    map.setView([pickup.lat, pickup.lng], 14)
  } else if (destination.lat && destination.lng) {
    // Center on destination
    map.setView([destination.lat, destination.lng], 14)
  }
}

// Update the route between markers
async function updateMapRoute() {
  if (!mapInstance.value || !L) return

  const pickup = bookingStore.pickup
  const destination = bookingStore.destination

  // Remove existing route if any
  if (routeControl.value) {
    mapInstance.value.removeControl(routeControl.value)
    routeControl.value = null
  }

  // Only create route if both markers exist
  if (pickup.lat && pickup.lng && destination.lat && destination.lng) {
    try {
      // Get route information from service
      const routeInfo = await locationService.getRouteInfo(
        { address: pickup.address, lat: pickup.lat, lng: pickup.lng },
        { address: destination.address, lat: destination.lat, lng: destination.lng }
      )

      // Update store with route information
      bookingStore.setRouteInfo(routeInfo.distance, routeInfo.duration)

      // Create route display with enhanced styling
      routeControl.value = L.Routing.control({
        waypoints: [
          L.latLng(pickup.lat, pickup.lng),
          L.latLng(destination.lat, destination.lng)
        ],
        lineOptions: {
          styles: [
            // Main route line - thicker and with gradient-like effect
            { color: '#f86906', opacity: 0.9, weight: 6 },
            // Secondary line (border effect)
            { color: '#ffffff', opacity: 0.5, weight: 10, offset: -3 },
            // Center highlight for a subtle 3D effect
            { color: '#ff9a4d', opacity: 0.8, weight: 3 }
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        // Custom router with additional options
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          useHints: false
        }),
        // Don't create default markers
        createMarker: function() { return null; },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        // Hide itinerary (text directions)
        show: false,
        routeWhileDragging: false
      }).addTo(mapInstance.value)

      // Apply route animation on initial draw
      if (routeControl.value._line) {
        applyRouteAnimation(routeControl.value._line);
      } else {
        // Sometimes the line is not immediately available, wait for the route event
        routeControl.value.on('routesfound', function(e) {
          if (e.routes && e.routes.length > 0) {
            applyRouteAnimation(routeControl.value._line);
          }
        });
      }
    } catch (error) {
      console.error('Error updating route:', error)
    }
  }
}

// Apply subtle animation to the route line
function applyRouteAnimation(line) {
  if (!line) return;

  // Add animation class
  if (line.options && line.options.className) {
    line.options.className += ' animated-route';
  } else if (line.options) {
    line.options.className = 'animated-route';
  }

  // For Leaflet polylines
  if (line._path) {
    line._path.classList.add('animated-route');
  }

  // For Leaflet layers
  if (line._layers) {
    Object.values(line._layers).forEach(layer => {
      if (layer._path) {
        layer._path.classList.add('animated-route');
      }
    });
  }
}

// Watch for changes in coordinates to update map
watch(() => bookingStore.pickup, () => {
  updateMapMarkers()
  updateMapRoute()
}, { deep: true })

watch(() => bookingStore.destination, () => {
  updateMapMarkers()
  updateMapRoute()
}, { deep: true })
</script>

<style scoped>
.route-map-component {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.route-map-component h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.map-container {
  height: 400px;
  width: 100%;
  border-radius: 4px;
  z-index: 1;
  margin-top: 1rem;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s ease;
}

.map-container:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.map-search {
  margin-bottom: 1rem;
  position: relative;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-with-icon input:focus {
  border-color: #f86906;
  outline: none;
  box-shadow: 0 0 0 2px rgba(248, 105, 6, 0.2);
}

.input-with-icon i {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #999;
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}

.clear-search:hover {
  color: #666;
}

.location-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-text {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.suggestion-description {
  font-size: 0.8rem;
  color: #999;
}

.map-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.map-control-btn {
  flex: 1;
  padding: 8px 10px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.map-control-btn:hover {
  background-color: #eeeeee;
}

.map-control-btn.active {
  background-color: #f8f2eb;
  border-color: #f86906;
  color: #f86906;
}

.map-control-btn i.icon-start {
  color: #f86906;
}

.map-control-btn i.icon-end {
  color: #25b847;
}

.map-instructions {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

.map-instructions i {
  color: #f86906;
  margin-right: 6px;
}

:deep(.map-marker-start i) {
  color: #f86906;
  font-size: 24px;
}

:deep(.map-marker-end i) {
  color: #25b847;
  font-size: 24px;
}

:deep(.leaflet-routing-container) {
  display: none;
}

:deep(.leaflet-marker-icon) {
  background: none;
  border: none;
}

:deep(.leaflet-overlay-pane path) {
  /* Apply subtle glow effect to route lines */
  filter: drop-shadow(0 0 2px rgba(248, 105, 6, 0.3));
  transition: all 0.3s ease;
}

:deep(.animated-route) {
  stroke-dasharray: 10, 5;
  animation: dashdraw 20s linear infinite;
}

@keyframes dashdraw {
  to {
    stroke-dashoffset: 300;
  }
}

/* Hover effect on the route line */
:deep(.leaflet-overlay-pane path:hover) {
  filter: drop-shadow(0 0 4px rgba(248, 105, 6, 0.6));
}

/* Add direction arrow markers along the route */
:deep(.leaflet-routing-alt) {
  display: none !important;
}

:deep(.leaflet-routing-container-hide) {
  display: none !important;
}

/* Marker Dragging Feedback Styles */
:deep(.dragging-marker) {
  z-index: 1000 !important;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.5));
  transition: transform 0.1s ease;
  transform: scale(1.2) translateY(-5px);
}

:deep(.dragging-marker.map-marker-start i) {
  color: #ff8c40;
}

:deep(.dragging-marker.map-marker-end i) {
  color: #35d45c;
}

:deep(.map-marker-start) {
  transition: transform 0.2s ease-out;
}

:deep(.map-marker-end) {
  transition: transform 0.2s ease-out;
}

/* Additional marker styling for better visibility */
:deep(.map-marker-start i) {
  color: #f86906;
  font-size: 32px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: color 0.2s ease;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
}

:deep(.map-marker-end i) {
  color: #25b847;
  font-size: 32px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: color 0.2s ease;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
}

/* Enhanced pulse animation */
:deep(.marker-pulse) {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(248, 105, 6, 0.4);
  animation: pulse 1.5s infinite;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: 0 0 10px rgba(248, 105, 6, 0.5);
}

:deep(.marker-pulse-end) {
  background-color: rgba(37, 184, 71, 0.4);
  box-shadow: 0 0 10px rgba(37, 184, 71, 0.5);
}

@keyframes pulse {
  0% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  70% {
    transform: translate(-50%, 0) scale(3);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 0;
  }
}
</style>
