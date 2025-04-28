import type {
  User,
  Driver,
  Passenger,
  Vehicle,
  BookingDetails,
  PopularDestination,
  Rating,
  Notification
} from '../types';

import { authService, bookingService, locationService } from '.';

/**
 * This is a simulated database service for the GetTransfer clone
 * In a real application, this would connect to a real backend API
 */
class DbService {
  private initializedDb: boolean = false;

  /**
   * Initialize the "database" with seed data
   */
  async initializeDb(): Promise<void> {
    // If already initialized, don't do it again
    if (this.initializedDb) return;

    try {
      console.log('Initializing database with seed data...');
      await this.seedDrivers();
      await this.seedPassengers();
      await this.seedBookings();
      await this.seedRatings();
      await this.seedVehicles();

      this.initializedDb = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  /**
   * Seed drivers data in localStorage
   */
  private async seedDrivers(): Promise<void> {
    const drivers: Driver[] = [
      {
        id: 1001,
        name: 'Alex Driver',
        email: 'alex@example.com',
        phone: '+1234567890',
        isDriver: true,
        licenseNumber: 'DRV12345',
        licenseExpiry: '2025-12-31',
        vehicleType: 'sedan',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vehicleYear: 2021,
        vehiclePlate: 'ABC123',
        vehicleRegistration: 'REG98765',
        isAvailable: true,
        rating: 4.8,
        totalRides: 156,
        totalEarnings: 5280
      },
      {
        id: 1002,
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '+1987654321',
        isDriver: true,
        licenseNumber: 'DRV54321',
        licenseExpiry: '2024-10-15',
        vehicleType: 'suv',
        vehicleMake: 'Honda',
        vehicleModel: 'CR-V',
        vehicleYear: 2022,
        vehiclePlate: 'XYZ789',
        vehicleRegistration: 'REG45678',
        isAvailable: true,
        rating: 4.9,
        totalRides: 203,
        totalEarnings: 7450
      },
      {
        id: 1003,
        name: 'Michael Johnson',
        email: 'michael@example.com',
        phone: '+1122334455',
        isDriver: true,
        licenseNumber: 'DRV67890',
        licenseExpiry: '2023-08-22',
        vehicleType: 'premium',
        vehicleMake: 'Mercedes',
        vehicleModel: 'E-Class',
        vehicleYear: 2023,
        vehiclePlate: 'LUX555',
        vehicleRegistration: 'REG12345',
        isAvailable: true,
        rating: 4.7,
        totalRides: 89,
        totalEarnings: 6200
      }
    ];

    localStorage.setItem('drivers', JSON.stringify(drivers));
  }

  /**
   * Seed passengers data in localStorage
   */
  private async seedPassengers(): Promise<void> {
    const passengers: Passenger[] = [
      {
        id: 2001,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1555666777',
        isDriver: false,
        totalRides: 12,
        totalSpent: 560
      },
      {
        id: 2002,
        name: 'Emily Brown',
        email: 'emily@example.com',
        phone: '+1777888999',
        isDriver: false,
        totalRides: 8,
        totalSpent: 420
      },
      {
        id: 2003,
        name: 'David Wilson',
        email: 'david@example.com',
        phone: '+1444555666',
        isDriver: false,
        totalRides: 23,
        totalSpent: 1150
      }
    ];

    localStorage.setItem('passengers', JSON.stringify(passengers));
  }

  /**
   * Seed bookings data in localStorage
   */
  private async seedBookings(): Promise<void> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const vehicle = {
      id: 'comfort',
      type: 'comfort',
      name: 'Comfort',
      capacity: 4,
      luggage: 3,
      price: 35
    };

    const bookings: BookingDetails[] = [
      {
        id: 3001,
        type: 'ride',
        pickup: { address: 'JFK Airport, New York', lat: 40.6413, lng: -73.7781 },
        destination: { address: 'Times Square, New York', lat: 40.7580, lng: -73.9855 },
        date: tomorrow.toISOString().split('T')[0],
        time: '14:30',
        vehicle,
        passengers: 2,
        luggage: 2,
        status: 'confirmed',
        driverId: 1001,
        driverName: 'Alex Driver',
        driverPhone: '+1234567890',
        driverRating: 4.8,
        driverVehicle: 'Toyota Camry (Black)',
        driverVehicleNumber: 'ABC123',
        price: 65,
        distance: 21,
        duration: 45,
        createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3002,
        type: 'hourly',
        pickup: { address: 'Central Park, New York', lat: 40.7812, lng: -73.9665 },
        destination: { address: 'Metropolitan Museum of Art, New York', lat: 40.7794, lng: -73.9632 },
        date: nextWeek.toISOString().split('T')[0],
        time: '10:00',
        vehicle,
        passengers: 3,
        luggage: 0,
        status: 'pending',
        price: 105,
        distance: 0,
        duration: 180,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3003,
        type: 'ride',
        pickup: { address: 'LaGuardia Airport, New York', lat: 40.7769, lng: -73.8740 },
        destination: { address: 'Brooklyn Bridge, New York', lat: 40.7061, lng: -73.9969 },
        date: today.toISOString().split('T')[0],
        time: '18:15',
        vehicle,
        passengers: 1,
        luggage: 1,
        status: 'completed',
        driverId: 1002,
        driverName: 'Sarah Smith',
        driverPhone: '+1987654321',
        driverRating: 4.9,
        driverVehicle: 'Honda CR-V (Silver)',
        driverVehicleNumber: 'XYZ789',
        price: 55,
        distance: 18,
        duration: 40,
        createdAt: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date(today.getTime() - 1000 * 60 * 60 * 2).toISOString()
      }
    ];

    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  /**
   * Seed ratings data in localStorage
   */
  private async seedRatings(): Promise<void> {
    const ratings: Rating[] = [
      {
        id: 4001,
        bookingId: 3003,
        userId: 2001,
        driverId: 1002,
        score: 5,
        comment: 'Excellent service, very professional driver',
        createdAt: new Date().toISOString()
      },
      {
        id: 4002,
        bookingId: 3002,
        userId: 2002,
        driverId: 1001,
        score: 4,
        comment: 'Good ride, clean car',
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem('ratings', JSON.stringify(ratings));
  }

  /**
   * Seed vehicles data in localStorage
   */
  private async seedVehicles(): Promise<void> {
    const vehicles: Vehicle[] = [
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

    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }

  /**
   * Get item from localStorage with type safety
   */
  getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}

export default new DbService();
