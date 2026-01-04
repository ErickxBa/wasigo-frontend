'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Star, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Viaje {
  id: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  precio: number;
  estado: 'proximo' | 'completado' | 'cancelado';
  conductor: {
    nombre: string;
    calificacion: number;
  };
}

export default function PassengerDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [viajesProximos] = useState<Viaje[]>([
    {
      id: 'viaje-1',
      origen: 'Universidad Central',
      destino: 'Centro Comercial Quicentro',
      fecha: '2025-12-31',
      hora: '09:00',
      precio: 2.50,
      estado: 'proximo',
      conductor: {
        nombre: 'Carlos Mendez',
        calificacion: 4.9,
      }
    }
  ]);

  const [viajesCompletados] = useState<Viaje[]>([
    {
      id: 'viaje-2',
      origen: 'Quito Centro',
      destino: 'La Mariscal',
      fecha: '2025-12-28',
      hora: '15:30',
      precio: 2.00,
      estado: 'completado',
      conductor: {
        nombre: 'María García',
        calificacion: 4.8,
      }
    }
  ]);

  // Redirigir si no está autenticado
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Mostrar loader mientras se carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-(--primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--muted-foreground)">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleVerEnMapa = (viajeId: string) => {
    router.push(`/passenger-route/${viajeId}`);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        
        {/* Próximo Viaje */}
        {viajesProximos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-(--foreground)">📍 Tu Próximo Viaje</h3>
            <div className="rounded-lg border border-(--border) bg-(--background) p-6 hover:shadow-md transition-shadow">
              {viajesProximos.map((viaje) => (
                <div key={viaje.id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Detalles */}
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-(--primary)" />
                        <h4 className="font-semibold text-lg text-(--foreground)">
                          {viaje.origen} → {viaje.destino}
                        </h4>
                      </div>
                      <div className="space-y-2 text-sm text-(--muted-foreground)">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-(--primary)" />
                          <span>{viaje.fecha} a las {viaje.hora}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-(--primary)" />
                          <span>Precio: <strong className="text-(--foreground)">${viaje.precio.toFixed(2)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Conductor */}
                    <div className="border-t border-(--border) pt-4 mt-4">
                      <p className="text-xs font-semibold text-(--muted-foreground) mb-3 uppercase">Conductor</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-(--primary) to-[#1a9970] rounded-full flex items-center justify-center text-white font-bold">
                          {viaje.conductor.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-(--foreground)">{viaje.conductor.nombre}</p>
                          <div className="flex items-center gap-1 text-(--warning) text-sm">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{viaje.conductor.calificacion}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-3 md:justify-center">
                    <Button
                      onClick={() => handleVerEnMapa(viaje.id)}
                      className="bg-(--primary) hover:bg-(--primary)/90 text-white w-full font-semibold flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver en Mapa
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-semibold flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Contactar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viajes Disponibles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-(--foreground)">🚗 Viajes Disponibles</h3>
            <Button asChild variant="ghost" size="sm">
              <Link href="/routes" className="flex items-center gap-2">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <p className="text-(--muted-foreground) text-sm">Explora más rutas compartidas disponibles</p>
        </div>

        {/* Viajes Completados */}
        {viajesCompletados.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-(--foreground)">✅ Viajes Completados</h3>
            <div className="space-y-3">
              {viajesCompletados.map((viaje) => (
                <div key={viaje.id} className="rounded-lg border border-(--border) bg-(--background) p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-(--foreground)">{viaje.origen} → {viaje.destino}</p>
                      <p className="text-sm text-(--muted-foreground)">{viaje.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-(--foreground)">${viaje.precio.toFixed(2)}</p>
                      <div className="flex items-center gap-1 text-(--warning) text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{viaje.conductor.calificacion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
