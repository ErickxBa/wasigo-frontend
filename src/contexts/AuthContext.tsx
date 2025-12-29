'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '@/services';

export type UserRole = 'visitante' | 'usuario' | 'pasajero' | 'conductor' | 'soporte' | 'admin';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  alias: string;
  role?: UserRole;
  rol?: string;
  foto?: string;
  calificacion?: number;
  verificado?: boolean;
  estadoVerificacion?: string;
  createdAt?: string;
  vehiculo?: {
    marca: string;
    modelo: string;
    color: string;
    placa: string;
    asientos: number;
  };
  paypalAccount?: string;
  fondosDisponibles?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  requiresVerification: boolean;
  sendVerificationCode: () => Promise<boolean>;
  confirmVerification: (code: string) => Promise<boolean>;
  setAuth: (data: { user: User; token: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, { password: string; user: User }> = {
  'test@epn.edu.ec': {
    password: '1234',
    user: {
      id: '1',
      nombre: 'Carlos',
      apellido: 'Mendoza',
      email: 'test@epn.edu.ec',
      celular: '0991234567',
      alias: 'Pasajero9201',
      role: 'pasajero',
      calificacion: 4.8,
      verificado: true,
    }
  },
  'pasajero.pendiente@epn.edu.ec': {
    password: '1234',
    user: {
      id: '10',
      nombre: 'Fernando',
      apellido: 'Castillo',
      email: 'pasajero.pendiente@epn.edu.ec',
      celular: '0991112233',
      alias: 'Pasajero1010',
      role: 'pasajero',
      calificacion: 4.5,
      verificado: true,
    }
  },
  'pasajero.rechazado@epn.edu.ec': {
    password: '1234',
    user: {
      id: '11',
      nombre: 'Lucia',
      apellido: 'Vargas',
      email: 'pasajero.rechazado@epn.edu.ec',
      celular: '0992223344',
      alias: 'Pasajero1111',
      role: 'pasajero',
      calificacion: 4.3,
      verificado: true,
    }
  },
  'conductor@epn.edu.ec': {
    password: '1234',
    user: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'conductor@epn.edu.ec',
      celular: '0987654321',
      alias: 'Conductor5432',
      role: 'conductor',
      calificacion: 4.9,
      verificado: true,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        placa: 'PBC1234',
        asientos: 4,
      },
      paypalAccount: 'maria.g@paypal.com',
      fondosDisponibles: 127.50,
    }
  },
  'soporte@epn.edu.ec': {
    password: '1234',
    user: {
      id: '3',
      nombre: 'Ana',
      apellido: 'Rodríguez',
      email: 'soporte@epn.edu.ec',
      celular: '0998765432',
      alias: 'Soporte001',
      role: 'soporte',
      calificacion: 5.0,
      verificado: true,
    }
  },
  'admin@epn.edu.ec': {
    password: '1234',
    user: {
      id: '4',
      nombre: 'Roberto',
      apellido: 'Paredes',
      email: 'admin@epn.edu.ec',
      celular: '0912345678',
      alias: 'Admin001',
      role: 'admin',
      calificacion: 5.0,
      verificado: true,
    }
  }
};

/**
 * Mapea el rol del backend al rol del frontend
 */
const mapRoleFromBackend = (rolBackend: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'ADMIN': 'admin',
    'SOPORTE': 'soporte',
    'CONDUCTOR': 'conductor',
    'PASAJERO': 'pasajero',
  };
  return roleMap[rolBackend] || 'usuario';
};

/**
 * Convierte la respuesta del backend a nuestro modelo User
 */
const convertBackendUserToLocalUser = (backendUser: any): User => {
  return {
    id: backendUser.id,
    nombre: backendUser.nombre,
    apellido: backendUser.apellido,
    email: backendUser.email,
    celular: backendUser.celular,
    alias: backendUser.alias,
    role: mapRoleFromBackend(backendUser.rol || 'PASAJERO'),
    rol: backendUser.rol,
    foto: backendUser.foto,
    calificacion: backendUser.calificacion || 0,
    verificado: backendUser.estadoVerificacion === 'VERIFICADO',
    estadoVerificacion: backendUser.estadoVerificacion,
    createdAt: backendUser.createdAt,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Cargar token e intentar restaurar sesión al montar el componente
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = authService.getToken();
        if (token && authService.isAuthenticated()) {
          // Token existe, asumir que el usuario está autenticado
          // Podrías hacer una llamada a un endpoint de "me" para obtener datos actuales
          // Por ahora mantenemos el token activo
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.error) {
        console.error('Login error:', response.error);
        return false;
      }

      if (response.data) {
        const { access_token, user: backendUser } = response.data;

        // Guardar token
        authService.setToken(access_token);

        // Convertir y guardar usuario
        const localUser = convertBackendUserToLocalUser(backendUser);
        setUser(localUser);

        // Verificar si requiere verificación
        setRequiresVerification(backendUser.estadoVerificacion !== 'VERIFICADO');

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setRequiresVerification(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role,
        alias: role === 'conductor' ? user.alias.replace('Pasajero', 'Conductor') : user.alias,
      });
    }
  };

  const sendVerificationCode = async (): Promise<boolean> => {
    try {
      const response = await authService.sendVerificationCode();
      return !response.error;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  };

  const confirmVerification = async (code: string): Promise<boolean> => {
    try {
      const response = await authService.confirmVerification({ code });

      if (response.error) {
        console.error('Verification error:', response.error);
        return false;
      }

      if (response.data && user) {
        // Actualizar estado del usuario
        setUser({
          ...user,
          verificado: true,
          estadoVerificacion: 'VERIFICADO',
        });
        setRequiresVerification(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Verification exception:', error);
      return false;
    }
  };

  const setAuth = (data: { user: any; token: string }) => {
    // Guardar token
    authService.setToken(data.token);

    // Convertir y guardar usuario
    const localUser = convertBackendUserToLocalUser(data.user);
    setUser(localUser);

    // Verificar si requiere verificación
    setRequiresVerification(data.user.estadoVerificacion !== 'VERIFICADO');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      switchRole,
      requiresVerification,
      sendVerificationCode,
      confirmVerification,
      setAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
