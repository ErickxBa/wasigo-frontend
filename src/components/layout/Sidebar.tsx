'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  Car,
  MessageCircle,
  User,
  LogOut,
  PlusCircle,
  Clock,
  Users,
  AlertTriangle,
  Settings,
  CreditCard,
  FileText,
  Shield,
  Wallet,
  CheckCircle,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
  separator?: boolean;
}

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: Home, label: 'Inicio', href: '/dashboard', roles: ['pasajero', 'conductor', 'soporte', 'admin'] },
    ]
  },
  {
    title: 'Pasajero',
    items: [
      { icon: Search, label: 'Buscar Rutas', href: '/rutas', roles: ['pasajero', 'conductor'] },
      { icon: Car, label: 'Mis Viajes', href: '/mis-viajes', roles: ['pasajero', 'conductor'] },
      { icon: MessageCircle, label: 'Chats', href: '/chats', roles: ['pasajero', 'conductor'], badge: 2 },
    ]
  },
  {
    title: 'Conductor',
    separator: true,
    items: [
      { icon: PlusCircle, label: 'Crear Ruta', href: '/crear-ruta', roles: ['conductor'] },
      { icon: Clock, label: 'Mis Rutas', href: '/mis-rutas', roles: ['conductor'] },
      { icon: CheckCircle, label: 'Validar OTP', href: '/validar-otp', roles: ['conductor'] },
      { icon: Car, label: 'Historial Viajes', href: '/historial-conductor', roles: ['conductor'] },
      { icon: Wallet, label: 'Mis Fondos', href: '/fondos', roles: ['conductor'] },
    ]
  },
  {
    title: 'Soporte',
    items: [
      { icon: AlertTriangle, label: 'Tickets', href: '/tickets', roles: ['soporte'], badge: 4 },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { icon: Users, label: 'Usuarios', href: '/usuarios', roles: ['soporte', 'admin'] },
      { icon: FileText, label: 'Solicitudes', href: '/solicitudes', roles: ['admin'], badge: 2 },
      { icon: CreditCard, label: 'Transacciones', href: '/transacciones', roles: ['admin'] },
      { icon: Shield, label: 'Auditoría', href: '/auditoria', roles: ['admin'] },
    ]
  },
  {
    items: [
      { icon: User, label: 'Mi Perfil', href: '/perfil', roles: ['pasajero', 'conductor', 'soporte', 'admin'] },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const location = usePathname();

  const getFilteredGroups = () => {
    return navGroups.map(group => ({
      ...group,
      items: group.items.filter(item => user && user.role && item.roles.includes(user.role))
    })).filter(group => group.items.length > 0);
  };

  const filteredGroups = getFilteredGroups();

  const getRoleBadge = () => {
    if (!user || !user.role) return null;
    const roleColors: Record<string, string> = {
      pasajero: 'bg-(--info)/20 text-(--info)',
      conductor: 'bg-(--success)/20 text-(--success)',
      soporte: 'bg-(--warning)/20 text-(--warning)',
      admin: 'bg-(--destructive)/20 text-(--destructive)',
    };
    return (
      <span className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
        roleColors[user.role] || 'bg-(--muted) text-(--muted-foreground)'
      )}>
        {user.role}
      </span>
    );
  };

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-50 h-full bg-(--sidebar-background) text-(--sidebar-foreground) transition-all duration-300",
      isOpen ? "w-64" : "w-20",
      mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-(--sidebar-border)">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--sidebar-primary) flex items-center justify-center">
            <Car className="w-6 h-6 text-(--sidebar-primary-foreground)" />
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-(--sidebar-foreground)">WasiGo</span>
          )}
        </Link>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg hover:bg-(--sidebar-accent)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      {user && isOpen && (
        <div className="p-4 border-b border-(--sidebar-border)">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-(--sidebar-accent) flex items-center justify-center text-(--sidebar-accent-foreground) font-semibold">
              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-(--sidebar-foreground)/70 truncate">{user.alias}</p>
            </div>
          </div>
          <div className="mt-2">
            {getRoleBadge()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {filteredGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.separator && isOpen && (
                <div className="h-px bg-(--sidebar-border) mb-4" />
              )}
              {group.title && isOpen && (
                <p className="px-3 mb-2 text-xs font-semibold text-(--sidebar-foreground)/50 uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-(--sidebar-primary) text-(--sidebar-primary-foreground)"
                            : "hover:bg-(--sidebar-accent) text-(--sidebar-foreground)/80 hover:text-(--sidebar-foreground)"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {isOpen && (
                          <>
                            <span className="flex-1 text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-(--sidebar-primary-foreground)/20 text-(--sidebar-primary-foreground)">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-(--sidebar-border)">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-(--sidebar-foreground)/70 hover:text-(--sidebar-foreground) hover:bg-(--sidebar-accent)"
          )}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
