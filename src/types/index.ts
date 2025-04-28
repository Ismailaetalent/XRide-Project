// User interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isDriver: boolean;
}

export interface Driver extends User {
  isDriver: true;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehiclePlate?: string;
  vehicleRegistration?: string;
  isAvailable?: boolean;
  rating?: number;
  totalRides?: number;
  totalEarnings?: number;
}

export interface Passenger extends User {
  isDriver: false;
  frequentLocations?: Location[];
  paymentMethods?: PaymentMethod[];
  totalRides?: number;
  totalSpent?: number;
}

// Location interfaces
export interface Location {
  address: string;
  lat?: number; // Optional latitude
  lng?: number; // Optional longitude
  placeId?: string;
}

export interface PopularDestination {
  id: number;
  name: string;
  description: string;
  image: string;
  country: string;
  lat: number;
  lng: number;
  popularRoutes: {
    from: string;
    to: string;
    price: number;
    distance: number;
    duration: number;
  }[];
}

// Vehicle interfaces
export interface Vehicle {
  id: string;
  type: string;
  name: string;
  capacity: number;
  luggage: number;
  price: number;
}

// Booking interfaces
export type BookingType = 'ride' | 'hourly';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingDetails {
  id?: number;
  type: BookingType;
  pickup: Location;
  destination: Location;
  date: string;
  time: string;
  vehicle: Vehicle;
  passengers: number;
  luggage: number;
  notes?: string;
  status?: BookingStatus;
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

// Payment interfaces
export interface PaymentMethod {
  id: number;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  cardholderName?: string;
}

// Rating and feedback interfaces
export interface Rating {
  id: number;
  bookingId: number;
  userId: number;
  driverId: number;
  score: number; // 1-5
  comment?: string;
  createdAt: string;
}

// Notification interfaces
export interface Notification {
  id: number;
  userId: number;
  type: 'booking_update' | 'payment' | 'promotion' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Route interfaces
export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  route: { lat: number; lng: number }[]; // waypoints for the route
}

// API interfaces
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
