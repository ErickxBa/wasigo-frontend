'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { verificationService } from '@/services';

export default function VerificationPage() {
  const router = useRouter();
  const { user, isLoading, requiresVerification, confirmVerification } = useAuth();
  
  const [step, setStep] = useState<'send' | 'confirm'>('send');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  // Verificar si el usuario está autenticado y requiere verificación
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No está autenticado
        router.push('/login');
        return;
      }
      
      if (user.estadoVerificacion === 'VERIFICADO') {
        // Ya está verificado, redirigir al dashboard
        const rol = user.rol?.toLowerCase();
        if (rol === 'conductor') {
          router.push('/driver/dashboard');
        } else {
          router.push('/passenger/dashboard');
        }
        return;
      }
      
      setIsChecking(false);
    }
  }, [user, isLoading, router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      console.log('[VerificationPage] Enviando código de verificación para:', user.id);
      const response = await verificationService.sendVerification(user.id);
      
      if (!response.error) {
        setCodeSent(true);
        setStep('confirm');
        toast.success('Código enviado a tu correo');
        console.log('[VerificationPage] Código enviado exitosamente');
      } else {
        setError(response.error || 'Error al enviar el código');
        toast.error('Error al enviar el código');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al enviar el código';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('[VerificationPage] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !code.trim()) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('El código debe ser 6 dígitos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('[VerificationPage] Confirmando código para:', user.id);
      const response = await verificationService.confirmVerification(user.id, { code });
      
      if (!response.error) {
        toast.success('¡Correo verificado exitosamente!');
        console.log('[VerificationPage] Verificación exitosa');
        
        // Actualizar estado en AuthContext
        const success = await confirmVerification(code);
        
        if (success) {
          // Redirigir al dashboard del pasajero (rol por defecto después de verificar)
          setTimeout(() => {
            router.push('/passenger/dashboard');
          }, 1500);
        }
      } else {
        const errorMsg = response.error || 'Código inválido o expirado';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al confirmar el código';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('[VerificationPage] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setCodeSent(false);
    setCode('');
    setStep('send');
  };

  // Mostrar loader mientras se verifica estado de autenticación
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-lg shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Verifica tu Correo</h1>
            <p className="text-muted-foreground text-sm">
              Te enviamos un código de verificación a <br />
              <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Paso 1: Enviar Código */}
          {step === 'send' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {codeSent 
                  ? 'Revisa tu bandeja de entrada o carpeta de spam' 
                  : 'Haz clic en el botón para recibir un código de verificación'}
              </p>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : codeSent ? (
                  '✓ Código Enviado'
                ) : (
                  'Enviar Código'
                )}
              </Button>

              {codeSent && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep('confirm')}
                >
                  Tengo mi Código
                </Button>
              )}
            </form>
          )}

          {/* Paso 2: Confirmar Código */}
          {step === 'confirm' && (
            <form onSubmit={handleConfirmCode} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Verificación</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center">
                  Ingresa los 6 dígitos del código
                </p>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Verificar
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleResendCode}
                disabled={loading}
              >
                ¿No recibiste el código?
              </Button>
            </form>
          )}

          {/* Info adicional */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Esto es necesario para usar todas las funciones de WasiGo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
