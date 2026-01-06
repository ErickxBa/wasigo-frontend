import { Ruta } from '@/data/mockData';

// Simular delay de 2 segundos
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type { Ruta };

export interface EstadisticasPasajero {
  viajesRealizados: number;
  proximosViajes: number;
  ahorroTotal: number;
  calificacion: number;
}

export interface ViajePasajero {
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

export async function obtenerEstadisticasPasajero(pasajeroId: string): Promise<EstadisticasPasajero> {
  await delay(2000);

  return {
    viajesRealizados: 12,
    proximosViajes: 2,
    ahorroTotal: 45.00,
    calificacion: 4.8
  };
}

export async function obtenerProximosViajes(pasajeroId: string): Promise<ViajePasajero[]> {
  await delay(2000);

  return [
    {
      id: '1',
      rutaId: '1',
      fecha: '2024-12-28',
      hora: '07:00',
      origen: 'Campus Principal',
      destino: 'San Rafael',
      conductor: {
        id: '2',
        nombre: 'María García',
        alias: 'MariaG',
        calificacion: 4.9,
      },
      otroPasajeros: [],
      estado: 'programado',
      otp: '1234',
      precio: 1.50,
      metodoPago: 'efectivo'
    }
  ];
}

export async function obtenerRutasDisponibles(): Promise<Ruta[]> {
  await delay(2000);

  return [
    {
      id: '1',
      conductorId: '2',
      conductorAlias: 'María G.',
      conductorCalificacion: 4.9,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Gris',
        placa: 'ABC-1234'
      },
      lugarSalida: 'Campus Principal',
      destino: 'San Rafael',
      fechaViaje: '2024-12-28',
      horaSalida: '07:00',
      asientosDisponibles: 2,
      asientosTotales: 4,
      precio: 1.50,
      estado: 'activa',
      pasajeros: []
    },
    {
      id: '2',
      conductorId: '3',
      conductorAlias: 'Carlos M.',
      conductorCalificacion: 4.7,
      vehiculo: {
        marca: 'Chevrolet',
        modelo: 'Spark',
        color: 'Rojo',
        placa: 'XYZ-5678'
      },
      lugarSalida: 'Sede El Bosque',
      destino: 'Quito Centro',
      fechaViaje: '2024-12-28',
      horaSalida: '08:00',
      asientosDisponibles: 3,
      asientosTotales: 3,
      precio: 2.00,
      estado: 'activa',
      pasajeros: []
    }
  ];
}

export async function obtenerViajesPasajero(pasajeroId: string): Promise<ViajePasajero[]> {
  await delay(2000);

  return [
    {
      id: '1',
      rutaId: '1',
      fecha: '2024-12-28',
      hora: '07:00',
      origen: 'Campus Principal',
      destino: 'San Rafael',
      conductor: {
        id: '2',
        nombre: 'María García',
        alias: 'MariaG',
        calificacion: 4.9,
      },
      otroPasajeros: [
        {
          id: '4',
          nombre: 'Juan Pérez',
          alias: 'JuanP',
        }
      ],
      estado: 'programado',
      otp: '1234',
      precio: 1.50,
      metodoPago: 'efectivo'
    },
    {
      id: '2',
      rutaId: '2',
      fecha: '2024-12-27',
      hora: '18:00',
      origen: 'Sede El Bosque',
      destino: 'Quito Norte',
      conductor: {
        id: '3',
        nombre: 'Carlos Martínez',
        alias: 'CarlosM',
        calificacion: 4.7,
      },
      otroPasajeros: [],
      estado: 'completado',
      otp: '5678',
      precio: 2.00,
      metodoPago: 'paypal'
    }
  ];
}

export async function filtrarRutas(campus?: string, destino?: string, hora?: string): Promise<Ruta[]> {
  const todasLasRutas = await obtenerRutasDisponibles();

  return todasLasRutas.filter(ruta => {
    if (campus && ruta.lugarSalida !== campus) return false;
    if (destino && !ruta.destino.toLowerCase().includes(destino.toLowerCase())) return false;
    if (hora && ruta.horaSalida !== hora) return false;
    return true;
  });
}
