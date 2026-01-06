'use client'

import React, { useState } from 'react';
import { authService } from '@/services';
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components';
import { Mail, Lock, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'email' | 'reset';

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    
    // Limpiar estado cuando se cierra el modal
    if (!newOpen) {
      setTimeout(() => {
        setStep('email');
        setEmail('');
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
      }, 300);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar email
    if (!email.endsWith('@epn.edu.ec')) {
      setError('Solo se aceptan correos @epn.edu.ec');
      return;
    }

    setLoading(true);

    try {
      console.log('[ForgotPasswordModal] Enviando solicitud de recuperación para:', email);
      const response = await authService.forgotPassword({ email });

      if (response.data) {
        const successMsg = 'Se envió un enlace de recuperación a tu correo.';
        setSuccess(successMsg);
        toast.success(successMsg);
        console.log('[ForgotPasswordModal] Código enviado exitosamente');
        
        // Avanzar al siguiente paso después de 1 segundo
        setTimeout(() => {
          setStep('reset');
        }, 1000);
      }
    } catch (err: any) {
      let errorMessage = 'Error al enviar el correo. Intenta nuevamente.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('[ForgotPasswordModal] Error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!token.trim()) {
      setError('El token/código es requerido');
      return;
    }

    if (newPassword.length < 7 || newPassword.length > 20) {
      setError('Contraseña debe tener entre 7 y 20 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      console.log('[ForgotPasswordModal] Reseteando contraseña...');
      const response = await authService.resetPassword({
        token: token.trim(),
        newPassword,
      });

      if (response.data) {
        const successMsg = '¡Contraseña actualizada! Cerrando...';
        setSuccess(successMsg);
        toast.success('Contraseña actualizada exitosamente');
        console.log('[ForgotPasswordModal] Contraseña reseteada exitosamente');
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          handleOpenChange(false);
        }, 2000);
      }
    } catch (err: any) {
      let errorMessage = 'Error al restablecer. Verifica el código e intenta nuevamente.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('[ForgotPasswordModal] Error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setError('');
    setSuccess('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // PASO 1: Solicitar reset
  if (step === 'email') {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Recuperar Contraseña</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSendEmail} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ingresa tu correo institucional para recibir un código de recuperación
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Institucional</label>
              <Input
                type="email"
                placeholder="usuario@epn.edu.ec"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">@epn.edu.ec</p>
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={loading || !email || !email.endsWith('@epn.edu.ec')}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Código
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // PASO 2: Restablecer contraseña
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Restablecer Contraseña</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ingresa el código del correo y tu nueva contraseña
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Código de Recuperación</label>
            <Input
              type="text"
              placeholder="Código del correo"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nueva Contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Mínimo 7 caracteres</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmar Contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleBack}
              disabled={loading}
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={loading || !token || !newPassword || newPassword !== confirmPassword}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Reseteando...
                </>
              ) : (
                <>
                  Confirmar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
