import { apiClient, type ApiResponse } from './api-client';

export interface DriverProfile {
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
  vehiculo: {
    id: string;
    marca: string;
    modelo: string;
    color: string;
    placa: string;
    asientos: number;
    documentacion: {
      matrizVerificada: boolean;
      soat: boolean;
      revisionTecnica: boolean;
    };
  };
  documentacion: {
    ciVerificada: boolean;
    licenciaVerificada: boolean;
    antecedentesVerificados: boolean;
  };
  fondosDisponibles: number;
  paypalAccount?: string;
  racionalesCompletados: number;
  createdAt: string;
}

export interface CreateDriverDto {
  vehiculo: {
    marca: string;
    modelo: string;
    color: string;
    placa: string;
    asientos: number;
  };
}

export interface UpdateDriverDto {
  alias?: string;
  foto?: string;
  paypalAccount?: string;
}

class DriverService {
  /**
   * Obtener perfil del conductor autenticado
   * GET /drivers/profile
   */
  async getProfile(): Promise<ApiResponse<DriverProfile>> {
    return apiClient.get<DriverProfile>('/drivers/profile');
  }

  /**
   * Obtener información de un conductor por ID
   * GET /drivers/:id
   */
  async getDriverById(id: string): Promise<ApiResponse<DriverProfile>> {
    return apiClient.get<DriverProfile>(`/drivers/${id}`);
  }

  /**
   * Actualizar perfil del conductor
   * PATCH /drivers/profile
   */
  async updateProfile(data: UpdateDriverDto): Promise<ApiResponse<DriverProfile>> {
    return apiClient.patch<DriverProfile>('/drivers/profile', data);
  }

  /**
   * Crear solicitud para ser conductor
   * POST /drivers/request
   */
  async createDriverRequest(data: CreateDriverDto): Promise<ApiResponse<{ message: string; driverId: string }>> {
    return apiClient.post<{ message: string; driverId: string }>('/drivers/request', data);
  }

  /**
   * Obtener historial de viajes del conductor
   * GET /drivers/trips/history
   */
  async getTripHistory(limit: number = 10, offset: number = 0): Promise<ApiResponse<{ trips: object[]; total: number }>> {
    return apiClient.get<{ trips: object[]; total: number }>('/drivers/trips/history', {
      params: { limit, offset },
    });
  }

  /**
   * Obtener estadísticas del conductor
   * GET /drivers/stats
   */
  async getStats(): Promise<ApiResponse<{
    totalTrips: number;
    totalEarnings: number;
    averageRating: number;
    thisMonthEarnings: number;
    cancelledTrips: number;
  }>> {
    return apiClient.get<{
      totalTrips: number;
      totalEarnings: number;
      averageRating: number;
      thisMonthEarnings: number;
      cancelledTrips: number;
    }>('/drivers/stats');
  }

  /**
   * Obtener disponibilidad actual del conductor
   * GET /drivers/availability
   */
  async getAvailability(): Promise<ApiResponse<{ isAvailable: boolean; status: string }>> {
    return apiClient.get<{ isAvailable: boolean; status: string }>('/drivers/availability');
  }

  /**
   * Actualizar disponibilidad del conductor
   * PATCH /drivers/availability
   */
  async updateAvailability(isAvailable: boolean): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>('/drivers/availability', { isAvailable });
  }
}

export const driverService = new DriverService();
