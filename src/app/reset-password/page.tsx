'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Input, Label } from '@/components';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '@/services';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token inválido o expirado');
      toast.error('Token no proporcionado');
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Token inválido o expirado');
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
      console.log('[ResetPasswordPage] Reseteando contraseña con token:', token);
      const response = await authService.resetPassword({
        token,
        newPassword,
      });

      if (response.data) {
        const successMsg = '¡Contraseña actualizada! Redirigiendo a login...';
        setSuccess(successMsg);
        toast.success('Contraseña actualizada exitosamente');
        console.log('[ResetPasswordPage] Contraseña reseteada exitosamente');

        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      let errorMessage = 'Error al restablecer. Verifica que el token sea válido.';

      if (err?.message) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('[ResetPasswordPage] Error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Restablecer Contraseña</h1>
            <p className="text-muted-foreground text-sm">
              Ingresa tu nueva contraseña para completar el restablecimiento
            </p>
          </div>

          {!token && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Token inválido o expirado. Solicita un nuevo enlace.</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm mb-4">
              <span>✓ {success}</span>
            </div>
          )}

          {token && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Entre 7 y 20 caracteres
                </p>
                {newPassword && (
                  <>
                    {newPassword.length >= 7 && newPassword.length <= 20 ? (
                      <p className="text-xs text-green-600">✓ Contraseña válida</p>
                    ) : (
                      <p className="text-xs text-destructive">✗ Debe tener entre 7 y 20 caracteres</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                {confirmPassword && (
                  <>
                    {newPassword === confirmPassword ? (
                      <p className="text-xs text-green-600">✓ Las contraseñas coinciden</p>
                    ) : (
                      <p className="text-xs text-destructive">✗ Las contraseñas no coinciden</p>
                    )}
                  </>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={
                  loading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword.length < 7 ||
                  newPassword.length > 20 ||
                  newPassword !== confirmPassword
                }
              >
                {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>

              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  ¿Recuerdas tu contraseña?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-primary hover:underline"
                  >
                    Volver al login
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
