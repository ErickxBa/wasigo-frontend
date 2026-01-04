'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Car, BarChart3, MapPin, CheckCircle2, TrendingUp, LogOut, Compass } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function GeneralDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    router.push('/login');
  };

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
      {/* Header */}
      <header className="h-16 bg-(--card) border-b border-(--border) flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-(--primary) flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-(--foreground)">WasiGo</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-(--foreground)">{user?.nombre} {user?.apellido}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="w-10 h-10 rounded-full bg-(--primary) flex items-center justify-center text-(--primary-foreground) font-semibold text-sm hover:bg-(--primary)/90 transition-colors"
            >
              {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
            </button>
            {showLogoutMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-(--background) rounded-lg shadow-lg border border-(--border) overflow-hidden z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-(--muted) transition-colors text-(--destructive) text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-(--foreground) mb-2">
            ¡Bienvenido a WasiGo, {user?.nombre}!
          </h1>
          <p className="text-lg text-(--muted-foreground)">
            Elige cómo deseas usar la plataforma
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Pasajero Card */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--primary)/5 rounded-bl-3xl"></div>
            <div className="p-8 relative z-10">
              <div className="w-16 h-16 bg-(--primary)/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-(--primary)" />
              </div>
              <h2 className="text-2xl font-bold text-(--foreground) mb-2">Soy Pasajero</h2>
              <p className="text-(--muted-foreground) mb-6">
                Busca y reserva viajes compartidos con conductores verificados
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-(--primary)" />
                  <span className="text-sm text-(--foreground)">Buscar rutas disponibles</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-(--primary)" />
                  <span className="text-sm text-(--foreground)">Reservar instantáneamente</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-(--primary)" />
                  <span className="text-sm text-(--foreground)">Conectar con conductores</span>
                </div>
              </div>

              <Button className="w-full hover:shadow-md hover:scale-105 transition-all" size="lg" asChild>
                <Link href="/(passenger)/dashboard-passenger">Ir al Panel de Pasajero</Link>
              </Button>
            </div>
          </Card>

          {/* Conductor Card */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--success)/5 rounded-bl-3xl"></div>
            <div className="p-8 relative z-10">
              <div className="w-16 h-16 bg-(--success)/10 rounded-lg flex items-center justify-center mb-4">
                <Compass className="w-8 h-8 text-(--success)" />
              </div>
              <h2 className="text-2xl font-bold text-(--foreground) mb-2">Soy Conductor</h2>
              <p className="text-(--muted-foreground) mb-6">
                Crea rutas y gana dinero compartiendo viajes
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-(--success)" />
                  <span className="text-sm text-(--foreground)">Gana dinero extra</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-(--success)" />
                  <span className="text-sm text-(--foreground)">Crea tus propias rutas</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-(--success)" />
                  <span className="text-sm text-(--foreground)">Visualiza tus ganancias</span>
                </div>
              </div>

              <Button className="w-full hover:shadow-md hover:scale-105 transition-all" size="lg" asChild>
                <Link href="/(driver)/dashboard-driver">Ir al Panel de Conductor</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="bg-(--card) border-t border-(--border) py-6 px-4 md:px-6 text-center text-(--muted-foreground) text-sm">
        <p>© 2025 WasiGo. Proyecto universitario EPN</p>
      </footer>
    </div>
  );
}
