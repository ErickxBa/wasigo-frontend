import { apiClient, type ApiResponse } from './api-client';

export interface PassengerProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  alias: string;
  foto?: string;
  calificacion: number;
  verificado: boolean;
  estado: 'activo' | 'inactivo' | 'suspendido';
  fondosDisponibles: number;
  metodoPago?: {
    tipo: 'tarjeta' | 'paypal' | 'billetera';
    ultimosCuatroDigitos: string;
  };
  viajesTotales: number;
  createdAt: string;
}

export interface UpdatePassengerDto {
  alias?: string;
  foto?: string;
  celular?: string;
  metodoPago?: {
    tipo: 'tarjeta' | 'paypal' | 'billetera';
    detalles: object;
  };
}

class PassengerService {
  /**
   * Obtener perfil del pasajero autenticado
   * GET /passengers/profile
   */
  async getProfile(): Promise<ApiResponse<PassengerProfile>> {
    return apiClient.get<PassengerProfile>('/passengers/profile');
  }

  /**
   * Obtener información de un pasajero por ID
   * GET /passengers/:id
   */
  async getPassengerById(id: string): Promise<ApiResponse<PassengerProfile>> {
    return apiClient.get<PassengerProfile>(`/passengers/${id}`);
  }

  /**
   * Actualizar perfil del pasajero
   * PATCH /passengers/profile
   */
  async updateProfile(data: UpdatePassengerDto): Promise<ApiResponse<PassengerProfile>> {
    return apiClient.patch<PassengerProfile>('/passengers/profile', data);
  }

  /**
   * Obtener historial de viajes
   * GET /passengers/trips/history
   */
  async getTripHistory(limit: number = 10, offset: number = 0): Promise<ApiResponse<{ trips: object[]; total: number }>> {
    return apiClient.get<{ trips: object[]; total: number }>('/passengers/trips/history', {
      params: { limit, offset },
    });
  }

  /**
   * Obtener estadísticas del pasajero
   * GET /passengers/stats
   */
  async getStats(): Promise<ApiResponse<{
    totalTrips: number;
    totalSpent: number;
    averageRating: number;
    thisMonthSpent: number;
    cancelledTrips: number;
  }>> {
    return apiClient.get<{
      totalTrips: number;
      totalSpent: number;
      averageRating: number;
      thisMonthSpent: number;
      cancelledTrips: number;
    }>('/passengers/stats');
  }

  /**
   * Agregar método de pago
   * POST /passengers/payment-methods
   */
  async addPaymentMethod(data: {
    tipo: 'tarjeta' | 'paypal' | 'billetera';
    detalles: object;
  }): Promise<ApiResponse<{ message: string; paymentMethodId: string }>> {
    return apiClient.post<{ message: string; paymentMethodId: string }>(
      '/passengers/payment-methods',
      data,
    );
  }

  /**
   * Obtener métodos de pago
   * GET /passengers/payment-methods
   */
  async getPaymentMethods(): Promise<ApiResponse<object[]>> {
    return apiClient.get<object[]>('/passengers/payment-methods');
  }

  /**
   * Eliminar método de pago
   * DELETE /passengers/payment-methods/:id
   */
  async deletePaymentMethod(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/passengers/payment-methods/${id}`);
  }

  /**
   * Obtener saldo disponible
   * GET /passengers/balance
   */
  async getBalance(): Promise<ApiResponse<{ fondosDisponibles: number; moneda: string }>> {
    return apiClient.get<{ fondosDisponibles: number; moneda: string }>('/passengers/balance');
  }

  /**
   * Recargar saldo
   * POST /passengers/balance/recharge
   */
  async rechargeBalance(monto: number, metodoPago: string): Promise<ApiResponse<{ message: string; nuevoSaldo: number }>> {
    return apiClient.post<{ message: string; nuevoSaldo: number }>('/passengers/balance/recharge', {
      monto,
      metodoPago,
    });
  }
}

export const passengerService = new PassengerService();
