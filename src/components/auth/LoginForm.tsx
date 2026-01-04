'use client'

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services';
import { Button, Input, Label } from '@/components';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const { setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar email
    if (!email.endsWith('@epn.edu.ec')) {
      setError('Solo se aceptan correos @epn.edu.ec');
      toast.error('Solo se aceptan correos @epn.edu.ec');
      return;
    }

    // Validar contraseña
    if (password.length < 7 || password.length > 20) {
      setError('Contraseña inválida');
      toast.error('Contraseña inválida');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.data) {
        // Guardar token y datos del usuario
        setAuth({
          user: response.data.user,
          token: response.data.access_token,
        });

        toast.success('¡Bienvenido a WasiGo!');
        
        // Determinar redirección según rol y estado de verificación
        const rol = response.data.user.rol?.toLowerCase();
        const estadoVerificacion = response.data.user.estadoVerificacion?.toUpperCase();
        
        console.log('[LoginForm] User:', { 
          rol, 
          estadoVerificacion,
          email: response.data.user.email 
        });
        
        // Lógica de redirección:
        // 1. Si NO está verificado → Ir a verificación
        // 2. Si está verificado → Dashboard general (donde acepta solicitudes de viaje)
        // 3. Una vez sea pasajero/conductor → accede a sus dashboards respectivos
        
        // Usar setTimeout para asegurar que el estado se actualice antes de redirigir
        setTimeout(() => {
          if (estadoVerificacion !== 'VERIFICADO') {
            // Usuario no verificado → Ir a página de verificación
            console.log('[LoginForm] Usuario no verificado, redirigiendo a verificación');
            router.push('/verification');
          } else {
            // Usuario verificado → Ir al dashboard general
            console.log('[LoginForm] Usuario verificado, redirigiendo a dashboard');
            router.push('/dashboard');
          }
        }, 100);
      }
    } catch (err: any) {
      let errorMessage = 'Credenciales incorrectas. Intenta nuevamente.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Si el error contiene detalles de validación, mostrar el primero
      if (err?.details?.message && Array.isArray(err.details.message)) {
        errorMessage = err.details.message[0] || errorMessage;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-(--destructive)/10 border border-(--destructive)/20 rounded-lg text-(--destructive) text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Correo Institucional</Label>
        <Input
          id="email"
          type="email"
          placeholder="usuario@epn.edu.ec"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />
        <p className="text-xs text-(--muted-foreground)">Debe ser @epn.edu.ec</p>
        {email && email.endsWith('@epn.edu.ec') && (
          <p className="text-xs text-(--success)">✓ Email válido</p>
        )}
        {email && !email.endsWith('@epn.edu.ec') && (
          <p className="text-xs text-(--destructive)">✗ Solo correos @epn.edu.ec</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            className="text-sm text-(--primary) hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) hover:text-(--foreground)"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={loading || !email || !password || !email.endsWith('@epn.edu.ec') || password.length < 7}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        {!loading && <ArrowRight className="w-5 h-5" />}
      </Button>

      <ForgotPasswordModal 
        open={showForgotPasswordModal} 
        onOpenChange={setShowForgotPasswordModal}
      />
    </form>
  );
}
