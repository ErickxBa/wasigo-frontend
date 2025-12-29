'use client';

import { useState } from 'react';
import { DashboardContent } from '@/components/passenger/DashboardContent';
import { PassengerDashboardSkeleton } from '@/components/common/SkeletonLoaders';
import { useAuth } from '@/contexts/AuthContext';
import type { Ruta } from '@/data/mockData';

interface EstadisticasPasajero {
  viajesRealizados: number;
  proximosViajes: number;
  ahorroTotal: number;
  calificacion: number;
}

interface ViajePasajero {
  id: string;
  rutaId: string;
  fecha: string;
  hora: string;
  origen: string;
  destino: string;
  conductor: {
    id: string;
    nombre: string;
    alias: string;
    calificacion: number;
    foto?: string;
  };
  otroPasajeros: Array<{
    id: string;
    nombre: string;
    alias: string;
    foto?: string;
  }>;
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  otp: string;
  precio: number;
  metodoPago: 'efectivo' | 'paypal' | 'tarjeta';
}

export default function DashboardPage() {
  console.log('[DashboardPage] Renderizando página...');
  
  const { user } = useAuth();
  const [isLoading] = useState(false);

  console.log('[DashboardPage] User:', user?.email);

  // Datos estáticos para demostración (sin delays)
  const estadisticas: EstadisticasPasajero = {
    viajesRealizados: 12,
    proximosViajes: 2,
    ahorroTotal: 45.00,
    calificacion: 4.8
  };

  const proximosViajes: ViajePasajero[] = [
    {
      id: 'viaje1',
      rutaId: 'ruta1',
      fecha: '2024-01-15',
      hora: '08:30',
      origen: 'Centro Norte',
      destino: 'Sector La Mariscal',
      conductor: {
        id: 'cond1',
        nombre: 'María García',
        alias: 'Mar.G',
        calificacion: 4.9,
      },
      otroPasajeros: [
        {
          id: 'pas1',
          nombre: 'Juan López',
          alias: 'JuanL',
        }
      ],
      estado: 'programado',
      otp: '5432',
      precio: 2.50,
      metodoPago: 'paypal',
    }
  ];

  const rutasDisponibles: Ruta[] = [];

  if (isLoading) {
    console.log('[DashboardPage] Mostrando skeleton loader');
    return <PassengerDashboardSkeleton />;
  }

  console.log('[DashboardPage] Renderizando DashboardContent');
  return (
    <DashboardContent
      estadisticas={estadisticas}
      proximosViajes={proximosViajes}
      rutasDisponibles={rutasDisponibles}
    />
  );
}
