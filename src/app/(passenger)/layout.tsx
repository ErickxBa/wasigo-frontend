'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout//Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { cn } from '@/lib/utils';

export default function PassengerLayout({
  children
}: {

  children: React.ReactNode;
}) {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('[PassengerLayout] State:', { isLoading, isAuthenticated, user: user?.email });
    
    // Solo redirigir si terminó de cargar y NO está autenticado
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('[PassengerLayout] No autenticado, redirigiendo a login');
        router.push('/login');
      } else {
        console.log('[PassengerLayout] Autenticado, mostrando dashboard');
        setIsChecking(false);
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostrar loader mientras se verifica autenticación o se carga la sesión
  if (isChecking || isLoading) {
    console.log('[PassengerLayout] Mostrando loader...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-(--foreground)/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <TopBar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}