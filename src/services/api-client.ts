/**
 * Cliente API base para todas las solicitudes HTTP
 * Maneja tokens JWT, errores y configuración global
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Cargar token del localStorage si existe
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  /**
   * Establece el token JWT para futuras solicitudes
   */
  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Construye los headers con autenticación y configuración
   */
  private buildHeaders(options?: RequestInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Construye la URL con parámetros de query
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Realiza una solicitud HTTP genérica
   */
  private async request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(path, options.params);
      const { params, ...requestOptions } = options;

      const response = await fetch(url, {
        ...requestOptions,
        headers: this.buildHeaders(requestOptions),
      });

      const data = await response.json();

      if (!response.ok) {
        // Extraer mensaje de error - puede ser un array o un string
        let errorMessage = '';
        if (data.message) {
          errorMessage = Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message;
        } else {
          errorMessage = `Error: ${response.status}`;
        }

        const error = new Error(errorMessage);
        (error as any).statusCode = response.status;
        (error as any).details = data;
        throw error;
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = (error as any)?.statusCode || 500;
      
      // Relanzar el error para que el llamador pueda manejarlo
      const err = new Error(errorMessage);
      (err as any).statusCode = statusCode;
      (err as any).details = (error as any)?.details || {};
      throw err;
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

// Instancia única del cliente API
export const apiClient = new ApiClient();

export type { ApiResponse, RequestOptions };
