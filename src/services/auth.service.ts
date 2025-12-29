import { apiClient, type ApiResponse } from './api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    celular: string;
    alias: string;
    rol: string;
    estadoVerificacion: string;
    foto?: string;
    createdAt?: string;
  };
  expiresIn?: string;
}

export interface RegisterResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    celular: string;
    rol?: string;
    estadoVerificacion?: string;
  };
}

export interface VerificationRequest {
  code: string;
}

class AuthService {
  /**
   * Registrar un nuevo usuario
   * POST /auth/register
   */
  async register(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  }

  /**
   * Iniciar sesión
   * POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  /**
   * Cerrar sesión
   * POST /auth/logout
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');
    // Limpiar token local
    apiClient.setToken(null);
    return response;
  }

  /**
   * Solicitar código OTP para verificación
   * POST /verification/send
   */
  async sendVerificationCode(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/verification/send');
  }

  /**
   * Confirmar verificación con código OTP
   * POST /verification/confirm
   */
  async confirmVerification(
    request: VerificationRequest,
  ): Promise<ApiResponse<{ message: string; user: object }>> {
    return apiClient.post<{ message: string; user: object }>(
      '/verification/confirm',
      request,
    );
  }

  /**
   * Solicitar reset de contraseña
   * POST /auth/forgot-password
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', request);
  }

  /**
   * Reset de contraseña con token
   * POST /auth/reset-password
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/reset-password', request);
  }

  /**
   * Cambiar contraseña (requiere autenticación)
   * PATCH /auth/change-password
   */
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>('/auth/change-password', request);
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return apiClient.getToken();
  }

  /**
   * Establecer el token
   */
  setToken(token: string | null): void {
    apiClient.setToken(token);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const authService = new AuthService();
