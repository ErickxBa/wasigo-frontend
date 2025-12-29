import { apiClient, type ApiResponse } from './api-client';

export interface VerificationRequest {
  code: string;
}

class VerificationService {
  /**
   * Solicitar código OTP para verificación
   * POST /verification/send/:userId
   */
  async sendVerification(userId: string): Promise<ApiResponse<{ code: string; expiresInMinutes: number }>> {
    return apiClient.post<{ code: string; expiresInMinutes: number }>(
      `/verification/send/${userId}`,
      {}
    );
  }

  /**
   * Confirmar verificación con código OTP
   * POST /verification/confirm/:userId
   */
  async confirmVerification(
    userId: string,
    request: VerificationRequest,
  ): Promise<ApiResponse<{ message: string; user: object }>> {
    return apiClient.post<{ message: string; user: object }>(
      `/verification/confirm/${userId}`,
      request,
    );
  }

  /**
   * Obtener intentos restantes
   * GET /verification/attempts/:userId
   */
  async getRemainingAttempts(userId: string): Promise<ApiResponse<{ remaining: number }>> {
    return apiClient.get<{ remaining: number }>(
      `/verification/attempts/${userId}`,
    );
  }
}

export const verificationService = new VerificationService();
