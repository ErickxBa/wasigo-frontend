'use client';

import { useEffect, useState } from 'react';
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
  const [rutasActivas, setRutasActivas] = useState<Ruta[]>([]);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <DriverHomeSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return <DriverHomeContent rutasActivas={rutasActivas} stats={stats!} />;
}
