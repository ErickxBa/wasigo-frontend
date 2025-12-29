'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Bell, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  onToggleSidebar,
  sidebarOpen
}) => {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 bg-(--card) border-b border-(--border) flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>

        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-(--foreground)">
            ¡Hola, {user?.nombre}!
          </h1>
          <p className="text-sm text-(--muted-foreground)">
            Bienvenido de vuelta a WasiGo
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Rating display */}
        {user && user.calificacion !== undefined && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-(--accent) rounded-lg">
            <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
            <span className="font-semibold text-sm">{user.calificacion.toFixed(1)}</span>
          </div>
        )}

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-(--primary) flex items-center justify-center text-(--primary-foreground) font-semibold text-sm">
          {user?.nombre.charAt(0)}{user?.apellido.charAt(0)}
        </div>
      </div>
    </header>
  );
};
