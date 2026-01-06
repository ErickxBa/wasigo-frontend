import { apiClient, type ApiResponse } from './api-client';

export interface Route {
  id: string;
  origen: {
    direccion: string;
    latitud: number;
    longitud: number;
  };
  destino: {
    direccion: string;
    latitud: number;
    longitud: number;
  };
  horario: {
    salida: string;
    llegadaEstimada: string;
  };
  conductor: {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
    calificacion: number;
    foto?: string;
    vehiculo: {
      marca: string;
      modelo: string;
      color: string;
      placa: string;
      asientos: number;
    };
  };
  asientosDisponibles: number;
  asientosTotales: number;
  precioBase: number;
  precio: number;
  estado: 'disponible' | 'en_progreso' | 'completado' | 'cancelado';
  descripcion?: string;
  createdAt: string;
}

export interface CreateRouteDto {
  origen: {
    direccion: string;
    latitud: number;
    longitud: number;
  };
  destino: {
    direccion: string;
    latitud: number;
    longitud: number;
  };
  horario: {
    salida: string;
  };
  asientos: number;
  precio: number;
  descripcion?: string;
}

export interface UpdateRouteDto {
  asientos?: number;
  precio?: number;
  descripcion?: string;
  estado?: 'disponible' | 'en_progreso' | 'completado' | 'cancelado';
}

export interface SearchRoutesParams {
  origen?: string;
  destino?: string;
  fechaSalida?: string;
  asientos?: number;
  precioMax?: number;
  limit?: number;
  offset?: number;
}

class RouteService {
  /**
   * Buscar rutas disponibles
   * GET /routes/search
   */
  async searchRoutes(params: SearchRoutesParams): Promise<ApiResponse<{ routes: Route[]; total: number }>> {
    return apiClient.get<{ routes: Route[]; total: number }>('/routes/search', {
      params: params as Record<string, string | number | boolean>,
    });
  }

  /**
   * Obtener ruta por ID
   * GET /routes/:id
   */
  async getRouteById(id: string): Promise<ApiResponse<Route>> {
    return apiClient.get<Route>(`/routes/${id}`);
  }

  /**
   * Obtener mis rutas (conductor autenticado)
   * GET /routes/my-routes
   */
  async getMyRoutes(estado?: string, limit: number = 10, offset: number = 0): Promise<ApiResponse<{ routes: Route[]; total: number }>> {
    const params: Record<string, string | number | boolean> = { limit, offset };
    if (estado) params.estado = estado;
    
    return apiClient.get<{ routes: Route[]; total: number }>('/routes/my-routes', { params });
  }

  /**
   * Crear una nueva ruta
   * POST /routes
   */
  async createRoute(data: CreateRouteDto): Promise<ApiResponse<Route>> {
    return apiClient.post<Route>('/routes', data);
  }

  /**
   * Actualizar una ruta
   * PATCH /routes/:id
   */
  async updateRoute(id: string, data: UpdateRouteDto): Promise<ApiResponse<Route>> {
    return apiClient.patch<Route>(`/routes/${id}`, data);
  }

  /**
   * Cancelar una ruta
   * PATCH /routes/:id/cancel
   */
  async cancelRoute(id: string, razon?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>(`/routes/${id}/cancel`, { razon });
  }

  /**
   * Obtener rutas cercanas por coordenadas
   * GET /routes/nearby
   */
  async getNearbyRoutes(
    latitud: number,
    longitud: number,
    radio: number = 5,
  ): Promise<ApiResponse<{ routes: Route[] }>> {
    return apiClient.get<{ routes: Route[] }>('/routes/nearby', {
      params: { latitud, longitud, radio },
    });
  }

  /**
   * Obtener rutas que coincidan origen-destino
   * GET /routes/match
   */
  async matchRoutes(
    origenLatitud: number,
    origenLongitud: number,
    destinoLatitud: number,
    destinoLongitud: number,
  ): Promise<ApiResponse<{ routes: Route[] }>> {
    return apiClient.get<{ routes: Route[] }>('/routes/match', {
      params: {
        origenLatitud,
        origenLongitud,
        destinoLatitud,
        destinoLongitud,
      },
    });
  }
}

export const routeService = new RouteService();
