import { apiClient, type ApiResponse } from './api-client';

export interface Booking {
  id: string;
  ruta: {
    id: string;
    origen: string;
    destino: string;
    horariosalida: string;
    precio: number;
  };
  conductor: {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
    calificacion: number;
  };
  pasajero: {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
  };
  asientoReservado: number;
  precio: number;
  estado: 'pendiente' | 'confirmado' | 'en_progreso' | 'completado' | 'cancelado';
  metodoPago: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  rutaId: string;
  asiento?: number;
  metodoPago: string;
  notasConductor?: string;
}

export interface CancelBookingDto {
  razon: string;
}

class BookingService {
  /**
   * Obtener mis reservas
   * GET /bookings/my-bookings
   */
  async getMyBookings(
    estado?: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<ApiResponse<{ bookings: Booking[]; total: number }>> {
    const params: Record<string, string | number | boolean> = { limit, offset };
    if (estado) params.estado = estado;

    return apiClient.get<{ bookings: Booking[]; total: number }>('/bookings/my-bookings', {
      params,
    });
  }

  /**
   * Obtener reserva por ID
   * GET /bookings/:id
   */
  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.get<Booking>(`/bookings/${id}`);
  }

  /**
   * Crear una nueva reserva
   * POST /bookings
   */
  async createBooking(data: CreateBookingDto): Promise<ApiResponse<Booking>> {
    return apiClient.post<Booking>('/bookings', data);
  }

  /**
   * Cancelar una reserva
   * PATCH /bookings/:id/cancel
   */
  async cancelBooking(id: string, data: CancelBookingDto): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>(`/bookings/${id}/cancel`, data);
  }

  /**
   * Obtener pasajeros de una ruta (para conductores)
   * GET /bookings/route/:rutaId/passengers
   */
  async getRoutePassengers(rutaId: string): Promise<ApiResponse<Booking[]>> {
    return apiClient.get<Booking[]>(`/bookings/route/${rutaId}/passengers`);
  }

  /**
   * Confirmar llegada (para conductores)
   * PATCH /bookings/:id/confirm-arrival
   */
  async confirmArrival(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>(`/bookings/${id}/confirm-arrival`);
  }

  /**
   * Iniciar viaje (para conductores)
   * PATCH /bookings/:id/start-trip
   */
  async startTrip(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>(`/bookings/${id}/start-trip`);
  }

  /**
   * Obtener reservas activas
   * GET /bookings/active
   */
  async getActiveBookings(): Promise<ApiResponse<{ bookings: Booking[] }>> {
    return apiClient.get<{ bookings: Booking[] }>('/bookings/active');
  }
}

export const bookingService = new BookingService();
