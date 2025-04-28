import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookingService } from '../services'
import type { Location, Vehicle, BookingDetails, BookingType } from '../types'

export const useBookingStore = defineStore('booking', () => {
  // State
  const bookingType = ref<BookingType>('ride')
  const pickup = ref<Location>({ address: '', lat: 0, lng: 0 })
  const destination = ref<Location>({ address: '', lat: 0, lng: 0 })
  const date = ref<string>('')
  const time = ref<string>('')
  const selectedVehicle = ref<string>('economy')
  const passengers = ref<number>(1)
  const luggage = ref<number>(0)
  const notes = ref<string>('')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Route information
  const routeDistance = ref<number>(0)
  const routeDuration = ref<number>(0)

  // Available vehicles
  const availableVehicles = ref<Vehicle[]>([])

  // Load available vehicles on initialization
  const loadVehicles = async () => {
    try {
      const vehicles = await bookingService.getVehicleTypes()
      availableVehicles.value = vehicles
    } catch (err) {
      console.error('Error loading vehicles:', err)
      // Fallback to default vehicles if API fails
      availableVehicles.value = [
        {
          id: 'economy',
          type: 'economy',
          name: 'Economy',
          capacity: 4,
          luggage: 2,
          price: 25
        },
        {
          id: 'comfort',
          type: 'comfort',
          name: 'Comfort',
          capacity: 4,
          luggage: 3,
          price: 35
        },
        {
          id: 'business',
          type: 'business',
          name: 'Business',
          capacity: 4,
          luggage: 3,
          price: 50
        }
      ]
    }
  }

  // Initial load
  loadVehicles()

  // Computed properties
  const currentVehicle = computed(() => {
    return availableVehicles.value.find(v => v.id === selectedVehicle.value) || availableVehicles.value[0]
  })

  const totalPrice = computed(() => {
    if (!currentVehicle.value) return 0

    let price = currentVehicle.value.price

    // Adjust price based on booking type
    if (bookingType.value === 'hourly') {
      // Hourly rates are typically higher
      price = price * 1.5
    }

    // If we have distance information, calculate based on distance
    if (routeDistance.value > 0 && bookingType.value === 'ride') {
      // Adding distance-based calculation (price per km)
      const pricePerKm = currentVehicle.value.price / 10 // This is a simplified formula
      price = Math.round(pricePerKm * routeDistance.value)

      // Ensure minimum price
      price = Math.max(price, currentVehicle.value.price)
    }

    return price
  })

  const bookingDetailsValid = computed(() => {
    return (
      pickup.value.address &&
      (bookingType.value === 'hourly' || destination.value.address) &&
      date.value &&
      time.value &&
      selectedVehicle.value &&
      passengers.value > 0
    )
  })

  // Methods
  const setBookingType = (type: BookingType) => {
    bookingType.value = type
  }

  const setPickup = (address: string) => {
    pickup.value = { address, lat: pickup.value.lat, lng: pickup.value.lng }
  }

  const setDestination = (address: string) => {
    destination.value = { address, lat: destination.value.lat, lng: destination.value.lng }
  }

  // Add methods to set coordinates
  const setPickupCoordinates = (lat: number, lng: number) => {
    pickup.value.lat = lat
    pickup.value.lng = lng
  }

  const setDestinationCoordinates = (lat: number, lng: number) => {
    destination.value.lat = lat
    destination.value.lng = lng
  }

  // Add method to set route info
  const setRouteInfo = (distance: number, duration: number) => {
    routeDistance.value = distance
    routeDuration.value = duration

    // Update the total price based on distance if available
    if (currentVehicle.value && distance > 0) {
      // Base price calculation could be updated here
      // For now, we'll continue using the fixed vehicle price
    }
  }

  const setVehicle = (vehicleId: string) => {
    const vehicle = availableVehicles.value.find(v => v.id === vehicleId)
    if (vehicle) {
      selectedVehicle.value = vehicleId
    }
  }

  const setDate = (newDate: string) => {
    date.value = newDate
  }

  const setTime = (newTime: string) => {
    time.value = newTime
  }

  const setPassengers = (count: number) => {
    passengers.value = count
  }

  const setLuggage = (count: number) => {
    luggage.value = count
  }

  const setNotes = (text: string) => {
    notes.value = text
  }

  const resetBooking = () => {
    bookingType.value = 'ride'
    pickup.value = { address: '', lat: 0, lng: 0 }
    destination.value = { address: '', lat: 0, lng: 0 }
    selectedVehicle.value = 'economy'
    passengers.value = 1
    luggage.value = 0
    notes.value = ''
  }

  const createBooking = async (): Promise<boolean> => {
    if (!bookingDetailsValid.value) {
      error.value = 'Please fill in all required fields'
      return false
    }

    loading.value = true
    error.value = null

    try {
      if (!currentVehicle.value) {
        throw new Error('No vehicle selected')
      }

      // Create the booking
      const bookingData: Omit<BookingDetails, 'id'> = {
        type: bookingType.value,
        pickup: pickup.value,
        destination: destination.value,
        date: date.value,
        time: time.value,
        vehicle: currentVehicle.value,
        passengers: passengers.value,
        luggage: luggage.value,
        notes: notes.value,
        distance: routeDistance.value || undefined,
        duration: routeDuration.value || undefined
      }

      await bookingService.createBooking(bookingData)

      // Reset the form
      resetBooking()

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred creating your booking'
      return false
    } finally {
      loading.value = false
    }
  }

  // Booking operations
  const getUserBookings = async (): Promise<BookingDetails[]> => {
    loading.value = true
    try {
      return await bookingService.getUserBookings()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load bookings'
      return []
    } finally {
      loading.value = false
    }
  }

  const getBookingById = async (id: number): Promise<BookingDetails | null> => {
    loading.value = true
    try {
      return await bookingService.getBookingById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to load booking ${id}`
      return null
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (id: number): Promise<boolean> => {
    loading.value = true
    try {
      await bookingService.cancelBooking(id)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to cancel booking ${id}`
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    bookingType,
    pickup,
    destination,
    date,
    time,
    selectedVehicle,
    passengers,
    luggage,
    notes,
    loading,
    error,
    availableVehicles,
    routeDistance,
    routeDuration,

    // Computed
    currentVehicle,
    totalPrice,
    bookingDetailsValid,

    // Methods
    setBookingType,
    setPickup,
    setDestination,
    setVehicle,
    setDate,
    setTime,
    setPassengers,
    setLuggage,
    setNotes,
    resetBooking,
    createBooking,
    setPickupCoordinates,
    setDestinationCoordinates,
    setRouteInfo,

    // Booking operations
    getUserBookings,
    getBookingById,
    cancelBooking,
    loadVehicles
  }
})
