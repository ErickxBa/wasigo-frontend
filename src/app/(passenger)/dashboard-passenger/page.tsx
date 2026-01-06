'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Users, Star, Car, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/StatusBadge';

interface Viaje {
  id: string;
  origen: string;
  destino: string;
  fecha: string;
  horaSalida: string;
  precio: number;
  estado: 'programado' | 'completado' | 'cancelado';
  conductor: {
    nombre: string;
    alias: string;
    calificacion: number;
    vehiculo: {
      marca: string;
      modelo: string;
    };
  };
  asientosDisponibles: number;
  asientosTotales: number;
}

export default function PassengerDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [viajesProximos] = useState<Viaje[]>([
    {
      id: 'viaje-1',
      origen: 'Campus Principal',
      destino: 'San Rafael',
      fecha: '2025-01-04',
      horaSalida: '07:00',
      precio: 2.50,
      estado: 'programado',
      conductor: {
        nombre: 'María G.',
        alias: 'maria-g',
        calificacion: 4.9,
        vehiculo: {
          marca: 'Toyota',
          modelo: 'Corolla',
        }
      },
      asientosDisponibles: 2,
      asientosTotales: 4,
    }
  ]);

  const [viajesCompletados] = useState<Viaje[]>([
    {
      id: 'viaje-2',
      origen: 'Quito Centro',
      destino: 'La Mariscal',
      fecha: '2025-12-28',
      horaSalida: '15:30',
      precio: 2.00,
      estado: 'completado',
      conductor: {
        nombre: 'Carlos M.',
        alias: 'carlos-m',
        calificacion: 4.8,
        vehiculo: {
          marca: 'Chevrolet',
          modelo: 'Cruze',
        }
      },
      asientosDisponibles: 1,
      asientosTotales: 5,
    }
  ]);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    router.push('/login');
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          
          {/* Próximos Viajes */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-(--foreground)">Mis Próximos Viajes</h2>
              </div>
              <Button asChild className="hover:shadow-md hover:scale-105 transition-all">
                <Link href="/routes" className="flex items-center gap-2">
                  Buscar más <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {viajesProximos.length > 0 ? (
              <div className="space-y-4">
                {viajesProximos.map((viaje) => (
                  <div key={viaje.id} className="card-interactive p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center">
                          <Car className="w-6 h-6 text-(--primary)" />
                        </div>
                        <div>
                          <p className="font-semibold text-(--foreground)">{viaje.conductor.nombre}</p>
                          <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
                            <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
                            <span>{viaje.conductor.calificacion.toFixed(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{viaje.conductor.vehiculo.marca} {viaje.conductor.vehiculo.modelo}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={viaje.estado} />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-(--success)/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-(--success)" />
                        </div>
                        <div>
                          <p className="text-xs text-(--muted-foreground)">Origen</p>
                          <p className="font-medium text-(--foreground)">{viaje.origen}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-(--destructive)/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-(--destructive)" />
                        </div>
                        <div>
                          <p className="text-xs text-(--muted-foreground)">Destino</p>
                          <p className="font-medium text-(--foreground)">{viaje.destino}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{viaje.horaSalida}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{viaje.asientosDisponibles}/{viaje.asientosTotales} asientos</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-(--border)">
                      <div>
                        <p className="text-2xl font-bold text-(--primary)">${viaje.precio.toFixed(2)}</p>
                        <p className="text-xs text-(--muted-foreground)">por asiento</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                        <Button size="sm">
                          Contactar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-(--muted-foreground) mx-auto mb-4" />
                <p className="text-(--muted-foreground)">No tienes viajes próximos</p>
                <Button asChild className="mt-4">
                  <Link href="/routes">Buscar viajes</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* Viajes Completados */}
          {viajesCompletados.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-(--foreground)">Viajes Completados</h2>
                <p className="text-(--muted-foreground) text-sm">Historial de tus viajes</p>
              </div>

              <div className="space-y-4">
                {viajesCompletados.map((viaje) => (
                  <div key={viaje.id} className="card-interactive p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-(--success)/10 flex items-center justify-center">
                          <Car className="w-6 h-6 text-(--success)" />
                        </div>
                        <div>
                          <p className="font-semibold text-(--foreground)">{viaje.conductor.nombre}</p>
                          <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
                            <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
                            <span>{viaje.conductor.calificacion.toFixed(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{viaje.conductor.vehiculo.marca} {viaje.conductor.vehiculo.modelo}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={viaje.estado} />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-(--success)/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-(--success)" />
                        </div>
                        <div>
                          <p className="text-xs text-(--muted-foreground)">Origen</p>
                          <p className="font-medium text-(--foreground)">{viaje.origen}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-(--destructive)/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-(--destructive)" />
                        </div>
                        <div>
                          <p className="text-xs text-(--muted-foreground)">Destino</p>
                          <p className="font-medium text-(--foreground)">{viaje.destino}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-(--border)">
                      <div>
                        <p className="text-2xl font-bold text-(--primary)">${viaje.precio.toFixed(2)}</p>
                        <p className="text-xs text-(--muted-foreground)">por asiento</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-(--card) border-t border-(--border) py-6 px-4 md:px-6 text-center text-(--muted-foreground) text-sm">
        <p>© 2025 WasiGo. Proyecto universitario EPN</p>
      </footer>
    </div>
  );
}
