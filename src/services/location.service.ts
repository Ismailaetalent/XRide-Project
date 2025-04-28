import api from '../api';

interface Location {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

interface LocationSuggestion {
  id: string;
  text: string;
  description: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  distance?: number;
}

interface PopularDestination {
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

// Define a class to hold geolocation information
class GeoLocationInfo {
  lat: number = 0;
  lng: number = 0;
  country: string = '';
  city: string = '';
  detected: boolean = false;
  loading: boolean = false;
  error: string | null = null;
}

class LocationService {
  // Store user's geolocation information
  userLocation: GeoLocationInfo = new GeoLocationInfo();

  // Mock popular locations by country
  private popularLocationsByCountry: Record<string, LocationSuggestion[]> = {
    'US': [
      { id: 'us-1', text: 'JFK Airport', description: 'New York International Airport', lat: 40.6413, lng: -73.7781 },
      { id: 'us-2', text: 'Times Square', description: 'Manhattan, New York', lat: 40.7580, lng: -73.9855 },
      { id: 'us-3', text: 'LAX Airport', description: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085 },
      { id: 'us-4', text: 'Golden Gate Bridge', description: 'San Francisco, California', lat: 37.8199, lng: -122.4783 }
    ],
    'GB': [
      { id: 'gb-1', text: 'Heathrow Airport', description: 'London International Airport', lat: 51.4700, lng: -0.4543 },
      { id: 'gb-2', text: 'Buckingham Palace', description: 'Westminster, London', lat: 51.5014, lng: -0.1419 },
      { id: 'gb-3', text: 'Manchester Airport', description: 'Manchester International Airport', lat: 53.3588, lng: -2.2727 },
      { id: 'gb-4', text: 'Edinburgh Castle', description: 'Edinburgh, Scotland', lat: 55.9486, lng: -3.1999 }
    ],
    'FR': [
      { id: 'fr-1', text: 'Charles de Gaulle Airport', description: 'Paris International Airport', lat: 49.0097, lng: 2.5479 },
      { id: 'fr-2', text: 'Eiffel Tower', description: 'Paris', lat: 48.8584, lng: 2.2945 },
      { id: 'fr-3', text: 'Nice Airport', description: 'Côte d\'Azur Airport', lat: 43.6584, lng: 7.2158 },
      { id: 'fr-4', text: 'Louvre Museum', description: 'Paris', lat: 48.8606, lng: 2.3376 }
    ],
    'DE': [
      { id: 'de-1', text: 'Frankfurt Airport', description: 'Frankfurt International Airport', lat: 50.0379, lng: 8.5622 },
      { id: 'de-2', text: 'Brandenburg Gate', description: 'Berlin', lat: 52.5163, lng: 13.3777 },
      { id: 'de-3', text: 'Munich Airport', description: 'Munich International Airport', lat: 48.3537, lng: 11.7860 },
      { id: 'de-4', text: 'Neuschwanstein Castle', description: 'Bavaria', lat: 47.5576, lng: 10.7498 }
    ],
    'default': [
      { id: 'default-1', text: 'Heathrow Airport', description: 'London International Airport', lat: 51.4700, lng: -0.4543 },
      { id: 'default-2', text: 'JFK Airport', description: 'New York International Airport', lat: 40.6413, lng: -73.7781 },
      { id: 'default-3', text: 'Charles de Gaulle Airport', description: 'Paris International Airport', lat: 49.0097, lng: 2.5479 },
      { id: 'default-4', text: 'Frankfurt Airport', description: 'Frankfurt International Airport', lat: 50.0379, lng: 8.5622 }
    ]
  };

  constructor() {
    // Initialize geolocation detection when service is instantiated
    this.detectUserLocation();
  }

  /**
   * Detect user's location using browser geolocation API
   */
  async detectUserLocation(): Promise<GeoLocationInfo> {
    // If we already have detected the location, return it
    if (this.userLocation.detected) {
      return this.userLocation;
    }

    // Set loading state
    this.userLocation.loading = true;
    this.userLocation.error = null;

    try {
      // Check if geolocation is available in the browser
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        // Update user location with coordinates
        this.userLocation.lat = position.coords.latitude;
        this.userLocation.lng = position.coords.longitude;

        // Reverse geocode to get country and city
        try {
          const locationDetails = await this.reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );

          if (locationDetails) {
            // Parse address to extract country and city
            const addressParts = locationDetails.address.split(',').map(part => part.trim());
            if (addressParts.length >= 2) {
              this.userLocation.city = addressParts[0];
              this.userLocation.country = addressParts[addressParts.length - 1];
            }
          }
        } catch (error) {
          console.warn('Error reverse geocoding user location:', error);
          // Use default country if reverse geocoding fails
          this.userLocation.country = 'default';
        }

        // Mark as detected
        this.userLocation.detected = true;
      } else {
        throw new Error('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      // Set error state
      this.userLocation.error = error instanceof Error ? error.message : 'Unknown error detecting location';
      console.error('Geolocation error:', this.userLocation.error);

      // Use default country
      this.userLocation.country = 'default';
    } finally {
      // End loading state
      this.userLocation.loading = false;
    }

    return this.userLocation;
  }

  /**
   * Get country code for user's location (2-letter code)
   */
  getUserCountryCode(): string {
    // Map some common country names to their ISO codes
    const countryMap: Record<string, string> = {
      'United States': 'US',
      'USA': 'US',
      'United Kingdom': 'GB',
      'UK': 'GB',
      'Great Britain': 'GB',
      'England': 'GB',
      'France': 'FR',
      'Germany': 'DE'
    };

    const countryName = this.userLocation.country;
    return countryMap[countryName] || 'default';
  }

  /**
   * Get nearby locations based on user's current location
   */
  async getNearbyLocations(): Promise<LocationSuggestion[]> {
    try {
      // Ensure user location is detected first
      await this.detectUserLocation();

      // Get country code to find relevant suggestions
      const countryCode = this.getUserCountryCode();

      // Get popular locations for the country, or use default if not found
      const suggestions = this.popularLocationsByCountry[countryCode] ||
                          this.popularLocationsByCountry['default'];

      // If we have user's coordinates, calculate distances to each suggestion
      if (this.userLocation.detected && this.userLocation.lat && this.userLocation.lng) {
        return suggestions.map(suggestion => {
          if (suggestion.lat && suggestion.lng) {
            const distance = this.calculateDistance(
              this.userLocation.lat,
              this.userLocation.lng,
              suggestion.lat,
              suggestion.lng
            );
            return { ...suggestion, distance };
          }
          return suggestion;
        }).sort((a, b) => {
          // Sort by distance if available
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return 0;
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Error getting nearby locations:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  /**
   * Search for locations based on query and return suggestions
   * Now incorporating nearby suggestions when query is short
   */
  async searchLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
    try {
      // Always get nearby locations first
      const nearbyLocations = await this.getNearbyLocations();

      // For very short or empty queries, return nearby locations
      if (!query || query.length < 3) {
        // Filter by query if provided
        if (query.length > 0) {
          return nearbyLocations.filter(location =>
            location.text.toLowerCase().includes(query.toLowerCase()) ||
            location.description.toLowerCase().includes(query.toLowerCase())
          );
        }

        return nearbyLocations;
      }

      // In a real implementation, this would use Google Places API
      // const response = await api.get(`/locations/search?query=${encodeURIComponent(query)}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return fake results based on query, prioritizing nearby locations that match
      // Filter nearby locations that match the query
      const matchingNearby = nearbyLocations.filter(location =>
        location.text.toLowerCase().includes(query.toLowerCase()) ||
        location.description.toLowerCase().includes(query.toLowerCase())
      );

      // Generate some additional mock suggestions
      const mockSuggestions: LocationSuggestion[] = [
        {
          id: `${query}-airport-1`,
          text: `${query} International Airport`,
          description: 'Airport',
          placeId: `airport-${Math.floor(Math.random() * 1000)}`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
        },
        {
          id: `${query}-station-1`,
          text: `${query} Central Station`,
          description: 'Train Station',
          placeId: `station-${Math.floor(Math.random() * 1000)}`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
        },
        {
          id: `${query}-hotel-1`,
          text: `${query} Grand Hotel`,
          description: 'Hotel',
          placeId: `hotel-${Math.floor(Math.random() * 1000)}`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
        },
        {
          id: `${query}-convention-1`,
          text: `${query} Convention Center`,
          description: 'Convention Center',
          placeId: `convention-${Math.floor(Math.random() * 1000)}`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
        },
        {
          id: `${query}-square-1`,
          text: `${query} Square`,
          description: 'City Square',
          placeId: `square-${Math.floor(Math.random() * 1000)}`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
        }
      ];

      // If we have the user's location, add distance to mock suggestions
      if (this.userLocation.detected && this.userLocation.lat && this.userLocation.lng) {
        mockSuggestions.forEach(suggestion => {
          if (suggestion.lat && suggestion.lng) {
            suggestion.distance = this.calculateDistance(
              this.userLocation.lat,
              this.userLocation.lng,
              suggestion.lat,
              suggestion.lng
            );
          }
        });
      }

      // Combine and prioritize nearby matches first
      const allSuggestions = [...matchingNearby, ...mockSuggestions];

      // Sort by distance if available
      if (this.userLocation.detected) {
        return allSuggestions.sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return 0;
        });
      }

      return allSuggestions;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to search locations');
    }
  }

  /**
   * Search for locations based on query
   */
  async searchLocations(query: string): Promise<Location[]> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get(`/locations/search?query=${encodeURIComponent(query)}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return fake results based on query
      if (!query || query.length < 2) return [];

      const mockLocations: Location[] = [
        {
          address: `${query} Airport`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
          placeId: `airport-${Math.floor(Math.random() * 1000)}`
        },
        {
          address: `${query} Central Station`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
          placeId: `station-${Math.floor(Math.random() * 1000)}`
        },
        {
          address: `${query} Hotel`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
          placeId: `hotel-${Math.floor(Math.random() * 1000)}`
        },
        {
          address: `${query} Convention Center`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
          placeId: `convention-${Math.floor(Math.random() * 1000)}`
        },
        {
          address: `${query} Square`,
          lat: 51.5074 + Math.random() * 0.1 - 0.05,
          lng: -0.1278 + Math.random() * 0.1 - 0.05,
          placeId: `square-${Math.floor(Math.random() * 1000)}`
        }
      ];

      return mockLocations;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to search locations');
    }
  }

  /**
   * Get details for a specific location by placeId
   */
  async getLocationDetails(placeId: string): Promise<Location> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get(`/locations/${placeId}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return fake result
      return {
        address: `Location ${placeId}`,
        lat: 51.5074 + Math.random() * 0.1 - 0.05,
        lng: -0.1278 + Math.random() * 0.1 - 0.05,
        placeId
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to get location details for ${placeId}`);
    }
  }

  /**
   * Geocode an address string to coordinates
   */
  async geocodeAddress(address: string): Promise<Location | null> {
    try {
      // In a real implementation, this would use a geocoding service
      // const response = await api.get(`/geocode?address=${encodeURIComponent(address)}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 400));

      if (!address) return null;

      // Mock geocode result
      return {
        address,
        lat: 51.5074 + Math.random() * 0.1 - 0.05,
        lng: -0.1278 + Math.random() * 0.1 - 0.05,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<Location | null> {
    try {
      // In a real implementation, this would use a reverse geocoding service
      // const response = await api.get(`/reverse-geocode?lat=${lat}&lng=${lng}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 400));

      // Mock reverse geocode result with country information
      const countries = ['United States', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain'];
      const cities = ['New York', 'London', 'Paris', 'Berlin', 'Rome', 'Madrid'];

      // Determine city and country based on coordinates (just for mock purposes)
      // In real implementation, this would return an actual result from the API
      const countryIndex = Math.floor(Math.abs(lat * lng) % countries.length);
      const cityIndex = Math.floor(Math.abs(lat + lng) % cities.length);

      return {
        address: `${cities[cityIndex]}, ${countries[countryIndex]}`,
        lat,
        lng,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Get route information between two locations
   */
  async getRouteInfo(origin: Location, destination: Location): Promise<{
    distance: number; // in kilometers
    duration: number; // in minutes
    route: { lat: number; lng: number }[];
  }> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.post('/locations/route', { origin, destination });
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 700));

      // Calculate fake distance (km) and duration (minutes)
      const lat1 = origin.lat;
      const lon1 = origin.lng;
      const lat2 = destination.lat;
      const lon2 = destination.lng;

      // Simple Haversine formula for distance calculation
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      // Generate a fake route path (simplified)
      const numPoints = 10;
      const route = [];
      for (let i = 0; i <= numPoints; i++) {
        const fraction = i / numPoints;
        route.push({
          lat: lat1 + (lat2 - lat1) * fraction + (Math.random() * 0.02 - 0.01) * (i > 0 && i < numPoints ? 1 : 0),
          lng: lon1 + (lon2 - lon1) * fraction + (Math.random() * 0.02 - 0.01) * (i > 0 && i < numPoints ? 1 : 0)
        });
      }

      return {
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        duration: Math.round(distance * 1.5), // Assume 1.5 minutes per km
        route
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to get route information');
    }
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(): Promise<PopularDestination[]> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get('/locations/popular');
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 800));

      return [
        {
          id: 1,
          name: 'London',
          description: 'Explore the historic capital of the United Kingdom',
          image: 'https://same-assets.com/images/4ed2b7de7f65decc9c0db0b1a97c2fd16edd2a0d.jpeg',
          country: 'United Kingdom',
          lat: 51.5074,
          lng: -0.1278,
          popularRoutes: [
            {
              from: 'Heathrow Airport',
              to: 'Central London',
              price: 60,
              distance: 24,
              duration: 45
            },
            {
              from: 'Gatwick Airport',
              to: 'Central London',
              price: 80,
              distance: 45,
              duration: 90
            }
          ]
        },
        {
          id: 2,
          name: 'Paris',
          description: 'The city of lights and romance',
          image: 'https://same-assets.com/images/c02e3fa9a2e0ffb5a2ca0c4dffcf16cd01e53b77.jpeg',
          country: 'France',
          lat: 48.8566,
          lng: 2.3522,
          popularRoutes: [
            {
              from: 'Charles de Gaulle Airport',
              to: 'Eiffel Tower',
              price: 65,
              distance: 28,
              duration: 45
            },
            {
              from: 'Orly Airport',
              to: 'Champs-Élysées',
              price: 55,
              distance: 20,
              duration: 35
            }
          ]
        },
        {
          id: 3,
          name: 'New York',
          description: 'The Big Apple - the city that never sleeps',
          image: 'https://same-assets.com/images/e851b97e5b8fc8b7aa8aef7dbe83ae59071851a3.jpeg',
          country: 'United States',
          lat: 40.7128,
          lng: -74.0060,
          popularRoutes: [
            {
              from: 'JFK Airport',
              to: 'Manhattan',
              price: 70,
              distance: 26,
              duration: 50
            },
            {
              from: 'LaGuardia Airport',
              to: 'Times Square',
              price: 60,
              distance: 16,
              duration: 40
            }
          ]
        },
        {
          id: 4,
          name: 'Barcelona',
          description: 'Stunning architecture and Mediterranean beaches',
          image: 'https://same-assets.com/images/2b4c4a7b95cebd63d6c28d5b85b3afecea13e3b6.jpeg',
          country: 'Spain',
          lat: 41.3851,
          lng: 2.1734,
          popularRoutes: [
            {
              from: 'Barcelona Airport',
              to: 'La Sagrada Familia',
              price: 45,
              distance: 18,
              duration: 35
            },
            {
              from: 'Barcelona Airport',
              to: 'La Rambla',
              price: 40,
              distance: 15,
              duration: 30
            }
          ]
        },
        {
          id: 5,
          name: 'Dubai',
          description: 'Ultra-modern luxury in the desert',
          image: 'https://same-assets.com/images/cab2f4af5c29f38b6e3d8a3efefa2a0e79bff7ad.jpeg',
          country: 'United Arab Emirates',
          lat: 25.2048,
          lng: 55.2708,
          popularRoutes: [
            {
              from: 'Dubai International Airport',
              to: 'Burj Khalifa',
              price: 50,
              distance: 15,
              duration: 25
            },
            {
              from: 'Dubai International Airport',
              to: 'Palm Jumeirah',
              price: 70,
              distance: 32,
              duration: 45
            }
          ]
        },
        {
          id: 6,
          name: 'Rome',
          description: 'The Eternal City with ancient history',
          image: 'https://same-assets.com/images/aba5fb97e90693f54dcdc84cb057bb83db7c29b2.jpeg',
          country: 'Italy',
          lat: 41.9028,
          lng: 12.4964,
          popularRoutes: [
            {
              from: 'Leonardo da Vinci Airport',
              to: 'Colosseum',
              price: 55,
              distance: 30,
              duration: 45
            },
            {
              from: 'Leonardo da Vinci Airport',
              to: 'Vatican City',
              price: 60,
              distance: 35,
              duration: 55
            }
          ]
        }
      ];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to get popular destinations');
    }
  }

  /**
   * Get destination details
   */
  async getDestinationDetails(id: number): Promise<PopularDestination> {
    try {
      // In a real implementation, this would hit an actual API endpoint
      // const response = await api.get(`/locations/destinations/${id}`);
      // return response.data;

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      const destinations = await this.getPopularDestinations();
      const destination = destinations.find(d => d.id === id);

      if (!destination) {
        throw new Error(`Destination with ID ${id} not found`);
      }

      return destination;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to get destination details for ID ${id}`);
    }
  }

  // Helper method
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default new LocationService();
