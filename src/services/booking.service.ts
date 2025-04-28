import api from '../api';

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface Vehicle {
  id: string;
  type: string;
  name: string;
  capacity: number;
  luggage: number;
  price: number;
}

interface BookingDetails {
  id?: number;
  type: 'ride' | 'hourly';
  pickup: Location;
  destination: Location;
  date: string;
  time: string;
  vehicle: Vehicle;
  passengers: number;
  luggage: number;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  driverVehicle?: string;
  driverVehicleNumber?: string;
  price?: number;
  distance?: number;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

class BookingService {
  /**
   * Get available vehicle types
   */
  async getVehicleTypes(): Promise<Vehicle[]> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get('/vehicles');
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      return [
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
        },
        {
          id: 'premium',
          type: 'premium',
          name: 'Premium',
          capacity: 4,
          luggage: 3,
          price: 75
        },
        {
          id: 'vip',
          type: 'vip',
          name: 'VIP',
          capacity: 4,
          luggage: 3,
          price: 100
        },
        {
          id: 'suv',
          type: 'suv',
          name: 'SUV',
          capacity: 6,
          luggage: 4,
          price: 60
        },
        {
          id: 'van',
          type: 'van',
          name: 'Van',
          capacity: 8,
          luggage: 8,
          price: 80
        },
        {
          id: 'minibus',
          type: 'minibus',
          name: 'Minibus',
          capacity: 16,
          luggage: 16,
          price: 120
        },
        {
          id: 'bus',
          type: 'bus',
          name: 'Bus',
          capacity: 50,
          luggage: 50,
          price: 250
        },
        {
          id: 'parcel',
          type: 'parcel',
          name: 'Parcel',
          capacity: 0,
          luggage: 10,
          price: 40
        }
      ];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to get vehicle types');
    }
  }

  /**
   * Create a booking
   */
  async createBooking(bookingData: Omit<BookingDetails, 'id'>): Promise<BookingDetails> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.post('/bookings', bookingData);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate distance and duration if not provided
      const distance = bookingData.distance || Math.floor(Math.random() * 100) + 5; // Random distance between 5-105 km
      const duration = bookingData.duration || Math.floor(Math.random() * 90) + 15; // Random duration between 15-105 minutes

      // Calculate price based on vehicle type and distance/duration
      let price = bookingData.vehicle.price;

      if (bookingData.type === 'ride' && distance > 0) {
        // For ride type, calculate based on distance
        const pricePerKm = bookingData.vehicle.price / 10; // This is a simplified formula
        price = Math.round(pricePerKm * distance);
        // Ensure minimum price
        price = Math.max(price, bookingData.vehicle.price);
      } else if (bookingData.type === 'hourly' && duration > 0) {
        // For hourly type, calculate based on duration (in hours)
        const durationHours = Math.ceil(duration / 60);
        price = bookingData.vehicle.price * durationHours;
      }

      // Simulate a server-side booking creation
      const mockBooking: BookingDetails = {
        ...bookingData,
        id: Math.floor(Math.random() * 10000),
        status: 'pending',
        price: price,
        distance: distance,
        duration: duration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage for persistence (In a real app, this would be server-side)
      this.saveBookingToLocalStorage(mockBooking);

      return mockBooking;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create booking');
    }
  }

  /**
   * Get a booking by ID
   */
  async getBookingById(id: number): Promise<BookingDetails> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get(`/bookings/${id}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retrieve from localStorage
      const bookings = this.getBookingsFromLocalStorage();
      const booking = bookings.find(b => b.id === id);

      if (!booking) {
        throw new Error(`Booking with ID ${id} not found`);
      }

      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to get booking with ID ${id}`);
    }
  }

  /**
   * Get all bookings for a user
   */
  async getUserBookings(): Promise<BookingDetails[]> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get('/bookings/user');
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 800));

      // Retrieve from localStorage
      return this.getBookingsFromLocalStorage();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to get user bookings');
    }
  }

  /**
   * Get all bookings for a driver
   */
  async getDriverBookings(): Promise<BookingDetails[]> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get('/bookings/driver');
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 800));

      // For this mock implementation, we'll just return some random bookings
      // In a real app, the driver would only see bookings assigned to them
      const mockDriverBookings: BookingDetails[] = [];

      // Generate 5 mock bookings
      for (let i = 0; i < 5; i++) {
        const randomVehicleType = ['economy', 'comfort', 'business', 'premium', 'vip'][
          Math.floor(Math.random() * 5)
        ];

        const vehicle: Vehicle = {
          id: randomVehicleType,
          type: randomVehicleType,
          name: randomVehicleType.charAt(0).toUpperCase() + randomVehicleType.slice(1),
          capacity: 4,
          luggage: 3,
          price: 30 + Math.floor(Math.random() * 70)
        };

        const randomStatus = ['pending', 'confirmed', 'in_progress', 'completed'][
          Math.floor(Math.random() * 4)
        ] as BookingDetails['status'];

        const today = new Date();
        const randomDays = Math.floor(Math.random() * 10);
        const bookingDate = new Date(today);
        bookingDate.setDate(today.getDate() + randomDays);

        mockDriverBookings.push({
          id: 10000 + i,
          type: Math.random() > 0.2 ? 'ride' : 'hourly',
          pickup: { address: 'Airport Terminal 1' },
          destination: { address: 'Downtown Hotel' },
          date: bookingDate.toISOString().split('T')[0],
          time: `${10 + Math.floor(Math.random() * 8)}:00`,
          vehicle,
          passengers: 1 + Math.floor(Math.random() * 4),
          luggage: Math.floor(Math.random() * 4),
          status: randomStatus,
          price: vehicle.price,
          distance: 15 + Math.floor(Math.random() * 30),
          duration: 20 + Math.floor(Math.random() * 40),
          createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          updatedAt: new Date().toISOString()
        });
      }

      return mockDriverBookings;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to get driver bookings');
    }
  }

  /**
   * Update a booking's status
   */
  async updateBookingStatus(id: number, status: BookingDetails['status']): Promise<BookingDetails> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.patch(`/bookings/${id}/status`, { status });
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retrieve from localStorage, update, and save
      const bookings = this.getBookingsFromLocalStorage();
      const bookingIndex = bookings.findIndex(b => b.id === id);

      if (bookingIndex === -1) {
        throw new Error(`Booking with ID ${id} not found`);
      }

      bookings[bookingIndex].status = status;
      bookings[bookingIndex].updatedAt = new Date().toISOString();

      // If the booking is confirmed, assign a driver
      if (status === 'confirmed' && !bookings[bookingIndex].driverId) {
        bookings[bookingIndex].driverId = 1000;
        bookings[bookingIndex].driverName = 'Alex Driver';
        bookings[bookingIndex].driverPhone = '+1234567890';
        bookings[bookingIndex].driverRating = 4.8;
        bookings[bookingIndex].driverVehicle = 'Toyota Camry (Black)';
        bookings[bookingIndex].driverVehicleNumber = 'ABC123';
      }

      localStorage.setItem('bookings', JSON.stringify(bookings));

      return bookings[bookingIndex];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to update booking status for ID ${id}`);
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: number): Promise<BookingDetails> {
    return this.updateBookingStatus(id, 'cancelled');
  }

  // Helper methods for localStorage handling (in a real app, this would be server-side logic)
  private saveBookingToLocalStorage(booking: BookingDetails): void {
    const bookings = this.getBookingsFromLocalStorage();
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  private getBookingsFromLocalStorage(): BookingDetails[] {
    const bookingsJson = localStorage.getItem('bookings');
    return bookingsJson ? JSON.parse(bookingsJson) : [];
  }
}

export default new BookingService();
