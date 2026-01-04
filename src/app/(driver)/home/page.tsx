'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DriverHomeContent } from '@/components/driver/DriverHomeContent';
import { DriverHomeSkeleton } from '@/components/common/SkeletonLoaders';
import { obtenerRutasActivas, obtenerEstadisticasConductor } from '@/lib/driverData';
import type { Ruta } from '@/data/mockData';

interface DriverStats {
  rutasActivas: number;
  viajesCompletados: number;
  fondosDisponibles: number;
  calificacion: number;
}

export default function HomePage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [rutasActivas, setRutasActivas] = useState<Ruta[]>([]);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const conductorId = '2'; // En producción vendría del contexto de auth
        const [rutas, estadisticas] = await Promise.all([
          obtenerRutasActivas(conductorId),
          obtenerEstadisticasConductor(conductorId),
        ]);

        setRutasActivas(rutas);
        setStats({
          rutasActivas: estadisticas.rutasActivas,
          viajesCompletados: estadisticas.viajesCompletados,
          fondosDisponibles: estadisticas.disponible,
          calificacion: estadisticas.calificacion
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (authLoading || isLoading) {
    return <DriverHomeSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Integrated with TopBar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <DriverHomeContent rutasActivas={rutasActivas} stats={stats!} />
      </div>
    </div>
  );
}
