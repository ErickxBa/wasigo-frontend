  import React from 'react';
import { cn } from '@/lib/utils';

type StatusType =
  | 'activa' | 'en_curso' | 'completada' | 'cancelada' | 'cancelado' | 'completado'
  | 'pendiente' | 'aprobada' | 'rechazada'
  | 'abierto' | 'en_revision' | 'resuelto' | 'cerrado'
  | 'confirmado' | 'no_show' | 'programado'
  | 'activo' | 'baneado' | 'suspendido'
  | 'success' | 'warning' | 'danger' | 'info';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Rutas/Viajes
  activa: { label: 'Activa', className: 'bg-(--success)/10 text-(--success) border-(--success)/20' },
  en_curso: { label: 'En Curso', className: 'bg-(--info)/10 text-(--info) border-(--info)/20' },
  completada: { label: 'Completada', className: 'bg-(--muted) text-(--muted-foreground) border-(--border)' },
  completado: { label: 'Completado', className: 'bg-(--muted) text-(--muted-foreground) border-(--border)' },
  cancelado: { label: 'Cancelado', className: 'bg-(--destructive)/10 text-(--destructive) border-(--destructive)/20' },
  cancelada: { label: 'Cancelada', className: 'bg-(--destructive)/10 text-(--destructive) border-(--destructive)/20' },
  programado: { label: 'Programado', className: 'bg-(--primary)/10 text-(--primary) border-(--primary)/20' },

  // Solicitudes
  pendiente: { label: 'Pendiente', className: 'bg-(--warning)/10 text-(--warning) border-(--warning)/20' },
  aprobada: { label: 'Aprobada', className: 'bg-(--success)/10 text-(--success) border-(--success)/20' },
  rechazada: { label: 'Rechazada', className: 'bg-(--destructive)/10 text-(--destructive) border-(--destructive)/20' },

  // Tickets
  abierto: { label: 'Abierto', className: 'bg-(--warning)/10 text-(--warning) border-(--warning)/20' },
  en_revision: { label: 'En Revisión', className: 'bg-(--info)/10 text-(--info) border-(--info)/20' },
  resuelto: { label: 'Resuelto', className: 'bg-(--success)/10 text-(--success) border-(--success)/20' },
  cerrado: { label: 'Cerrado', className: 'bg-(--muted) text-(--muted-foreground) border-(--border)' },

  // Pasajeros
  confirmado: { label: 'Confirmado', className: 'bg-(--success)/10 text-(--success) border-(--success)/20' },
  no_show: { label: 'No Show', className: 'bg-(--destructive)/10 text-(--destructive) border-(--destructive)/20' },

  // Usuarios
  activo: { label: 'Activo', className: 'bg-(--success)/10 text-(--success) border-(--success)/20' },
  baneado: { label: 'Baneado', className: 'bg-(--destructive)/10 text-(--destructive) border-(--destructive)/20' },
  suspendido: { label: 'Suspendido', className: 'bg-(--warning)/10 text-(--warning) border-(--warning)/20' },

  // Generic
  success: { label: 'Éxito', className: 'bg-(--success)/10 text-(--success) border-(--success)/20' },
  warning: { label: 'Advertencia', className: 'bg-(--warning)/10 text-(--warning) border-(--warning)/20' },
  danger: { label: 'Error', className: 'bg-(--destructive)/10 text-(--destructive) border-(--destructive)/20' },
  info: { label: 'Info', className: 'bg-(--info)/10 text-(--info) border-(--info)/20' },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {

  const config = statusConfig[status] || statusConfig.info;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
