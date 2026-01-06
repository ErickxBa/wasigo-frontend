// API Client
export { apiClient } from './api-client';
export type { ApiResponse, RequestOptions } from './api-client';

// Auth Service
export { authService } from './auth.service';
export type { LoginCredentials, RegisterData, AuthResponse, VerificationRequest } from './auth.service';

// Verification Service
export { verificationService } from './verification.service';
export type { VerificationRequest as VerificationRequestType } from './verification.service';

// Driver Service
export { driverService } from './driver.service';
export type { DriverProfile, CreateDriverDto, UpdateDriverDto } from './driver.service';

// Passenger Service
export { passengerService } from './passenger.service';
export type { PassengerProfile, UpdatePassengerDto } from './passenger.service';

// Route Service
export { routeService } from './route.service';
export type { Route, CreateRouteDto, UpdateRouteDto, SearchRoutesParams } from './route.service';

// Booking Service
export { bookingService } from './booking.service';
export type { Booking, CreateBookingDto, CancelBookingDto } from './booking.service';

// Rating Service
export { ratingService } from './rating.service';
export type { Rating, CreateRatingDto } from './rating.service';
