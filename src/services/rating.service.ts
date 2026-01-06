import { apiClient, type ApiResponse } from './api-client';

export interface Rating {
  id: string;
  de: {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
  };
  para: {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
  };
  viaje: {
    id: string;
    origen: string;
    destino: string;
    fecha: string;
  };
  calificacion: number;
  comentario?: string;
  tipo: 'pasajero' | 'conductor';
  createdAt: string;
}

export interface CreateRatingDto {
  viajeId: string;
  calificacion: number;
  comentario?: string;
  tipo: 'pasajero' | 'conductor';
}

class RatingService {
  /**
   * Crear una calificación
   * POST /ratings
   */
  async createRating(data: CreateRatingDto): Promise<ApiResponse<Rating>> {
    return apiClient.post<Rating>('/ratings', data);
  }

  /**
   * Obtener calificaciones recibidas
   * GET /ratings/received
   */
  async getReceivedRatings(limit: number = 10, offset: number = 0): Promise<ApiResponse<{ ratings: Rating[]; total: number }>> {
    return apiClient.get<{ ratings: Rating[]; total: number }>('/ratings/received', {
      params: { limit, offset },
    });
  }

  /**
   * Obtener calificaciones dadas
   * GET /ratings/given
   */
  async getGivenRatings(limit: number = 10, offset: number = 0): Promise<ApiResponse<{ ratings: Rating[]; total: number }>> {
    return apiClient.get<{ ratings: Rating[]; total: number }>('/ratings/given', {
      params: { limit, offset },
    });
  }

  /**
   * Obtener promedio de calificaciones del usuario
   * GET /ratings/average/:userId
   */
  async getAverageRating(userId: string): Promise<ApiResponse<{ promedio: number; total: number }>> {
    return apiClient.get<{ promedio: number; total: number }>(`/ratings/average/${userId}`);
  }

  /**
   * Actualizar una calificación
   * PATCH /ratings/:id
   */
  async updateRating(id: string, data: Partial<CreateRatingDto>): Promise<ApiResponse<Rating>> {
    return apiClient.patch<Rating>(`/ratings/${id}`, data);
  }

  /**
   * Eliminar una calificación
   * DELETE /ratings/:id
   */
  async deleteRating(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/ratings/${id}`);
  }
}

export const ratingService = new RatingService();
