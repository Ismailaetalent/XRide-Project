import authService from './auth.service';
import bookingService from './booking.service';
import locationService from './location.service';
import dbService from './db.service';

export {
  authService,
  bookingService,
  locationService,
  dbService
};

// Default export for convenience
export default {
  auth: authService,
  booking: bookingService,
  location: locationService,
  db: dbService
};
