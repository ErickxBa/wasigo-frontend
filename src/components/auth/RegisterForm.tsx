'use client'

import React, { useState } from 'react';
import { authService, verificationService } from '@/services';
import { Button, Input, Label, Checkbox } from '@/components';
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormData {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [verificationAttempts, setVerificationAttempts] = useState(3);
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
  });

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = () => {
    setStep(2);
  };

  const validateNombre = (nombre: string): string | null => {
    if (nombre.length < 3) return 'Mínimo 3 caracteres';
    if (nombre.length > 15) return 'Máximo 15 caracteres';
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(nombre)) return 'Solo letras y espacios';
    return null;
  };

  const validateApellido = (apellido: string): string | null => {
    if (apellido.length < 3) return 'Mínimo 3 caracteres';
    if (apellido.length > 15) return 'Máximo 15 caracteres';
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(apellido)) return 'Solo letras y espacios';
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.includes('@')) return 'Debe contener @';
    if (!email.endsWith('@epn.edu.ec')) return 'Solo correos @epn.edu.ec';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 7) return 'Mínimo 7 caracteres';
    if (password.length > 20) return 'Máximo 20 caracteres';
    if (!/[a-z]/.test(password)) return 'Debe incluir una letra minúscula';
    if (!/[A-Z]/.test(password)) return 'Debe incluir una letra mayúscula';
    if (!/\d/.test(password)) return 'Debe incluir un número';
    if (!/[!@#$%^&*]/.test(password)) return 'Debe incluir un carácter especial (!@#$%^&*)';
    return null;
  };

  const validateCelular = (celular: string): string | null => {
    if (!celular) return 'Requerido';
    if (!/^09\d{8}$/.test(celular)) return 'Formato: 09XXXXXXXX';
    return null;
  };

  const isCelularValid = (celular: string): boolean => {
    return /^09\d{8}$/.test(celular);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar cada campo
    const nombreError = validateNombre(formData.nombre);
    if (nombreError) {
      setError(`Nombre: ${nombreError}`);
      toast.error(`Nombre: ${nombreError}`);
      return;
    }

    const apellidoError = validateApellido(formData.apellido);
    if (apellidoError) {
      setError(`Apellido: ${apellidoError}`);
      toast.error(`Apellido: ${apellidoError}`);
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(`Email: ${emailError}`);
      toast.error(`Email: ${emailError}`);
      return;
    }

    const celularError = validateCelular(formData.celular);
    if (celularError) {
      setError(`Celular: ${celularError}`);
      toast.error(`Celular: ${celularError}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(`Contraseña: ${passwordError}`);
      toast.error(`Contraseña: ${passwordError}`);
      return;
    }

    if (!formData.aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      // Registrar usuario
      const response = await authService.register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        celular: formData.celular,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      console.log('Register response:', response);

      // La respuesta tiene estructura: { success: true, data: { user: { id (publicId), ... } }, timestamp: ... }
      const userId = response?.data?.user?.id;

      if (userId) {
        setUserId(userId);
        
        // Solicitar envío de código de verificación
        await verificationService.sendVerification(userId);
        
        toast.success('Se envió un código de verificación a tu correo');
        setStep(3);
      } else {
        console.error('Response structure:', response);
        setError('Error: No se obtuvo el ID del usuario registrado');
        toast.error('Error en el registro: falta el ID del usuario');
      }
    } catch (err: any) {
      // Extraer mensaje de error detallado del servidor
      let errorMessage = 'Error al registrarse';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Si el error contiene detalles de validación, mostrar el primero
      if (err?.details?.message && Array.isArray(err.details.message)) {
        errorMessage = err.details.message[0] || errorMessage;
      }

      console.error('Register error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    // Auto-focus siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    const code = verificationCode.join('');

    if (code.length !== 6) {
      setError('Por favor ingresa los 6 dígitos del código');
      toast.error('Código incompleto');
      return;
    }

    setLoading(true);

    try {
      await verificationService.confirmVerification(userId, { code });
      toast.success('¡Cuenta verificada exitosamente!');
      
      // Esperar un poco y redirigir
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Código inválido';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Decrementar intentos
      const newAttempts = verificationAttempts - 1;
      setVerificationAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setError('Se agotaron los intentos. Por favor solicita un nuevo código.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    setVerificationCode(['', '', '', '', '', '']);

    try {
      await verificationService.sendVerification(userId);
      toast.success('Se envió un nuevo código a tu correo');
      setVerificationAttempts(3);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reenviar código';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            placeholder="Carlos"
            value={formData.nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nombre', e.target.value)}
            icon={<User className="w-5 h-5" />}
            required
          />
          {formData.nombre && validateNombre(formData.nombre) && (
            <p className="text-xs text-(--destructive)">{validateNombre(formData.nombre)}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            placeholder="Mendoza"
            value={formData.apellido}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('apellido', e.target.value)}
            required
          />
          {formData.apellido && validateApellido(formData.apellido) && (
            <p className="text-xs text-(--destructive)">{validateApellido(formData.apellido)}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="celular">Celular</Label>
        <Input
          id="celular"
          placeholder="0991234567"
          value={formData.celular}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/\D/g, '');
            handleChange('celular', value.slice(0, 10));
          }}
          icon={<Phone className="w-5 h-5" />}
          required
        />
        <p className="text-xs text-(--muted-foreground)">Formato: 09XXXXXXXX (10 dígitos)</p>
        {formData.celular && isCelularValid(formData.celular) && (
          <p className="text-xs text-(--success)">✓ Formato válido</p>
        )}
        {formData.celular && !isCelularValid(formData.celular) && (
          <p className="text-xs text-(--destructive)">✗ Debe ser 09 + 8 dígitos</p>
        )}
      </div>

      <Button
        type="button"
        variant="hero"
        size="lg"
        className="w-full"
        onClick={handleStep1Submit}
        disabled={
          !formData.nombre || 
          !formData.apellido || 
          !formData.celular ||
          validateNombre(formData.nombre) !== null ||
          validateApellido(formData.apellido) !== null ||
          !isCelularValid(formData.celular)
        }
      >
        Continuar
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderStep2 = () => {
    const passwordError = validatePassword(formData.password);
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    return (
    <div className="space-y-5 animate-fade-in">
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
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />
        <p className="text-xs text-(--muted-foreground)">Debe ser @epn.edu.ec</p>
        {formData.email && !formData.email.endsWith('@epn.edu.ec') && (
          <p className="text-xs text-(--destructive)">✗ Solo correos @epn.edu.ec</p>
        )}
        {formData.email && formData.email.endsWith('@epn.edu.ec') && (
          <p className="text-xs text-(--success)">✓ Email válido</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
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
        {formData.password && (
          <div className="space-y-1 text-xs">
            <p className={!/[a-z]/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
              ✓ Al menos una letra minúscula
            </p>
            <p className={!/[A-Z]/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
              ✓ Al menos una letra mayúscula
            </p>
            <p className={!/\d/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
              ✓ Al menos un número
            </p>
            <p className={!/[^A-Za-z\d]/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
              ✓ Al menos un carácter especial (!@#$%^&*)
            </p>
            <p className={formData.password.length < 7 ? 'text-(--muted-foreground)' : 'text-(--success)'}>
              ✓ Mínimo 7 caracteres
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('confirmPassword', e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          required
        />
        {formData.password && formData.confirmPassword && (
          <p className={passwordsMatch ? 'text-xs text-(--success)' : 'text-xs text-(--destructive)'}>
            {passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="terminos"
          checked={formData.aceptaTerminos}
          onCheckedChange={(checked: boolean) => handleChange('aceptaTerminos', checked)}
        />
        <label htmlFor="terminos" className="text-sm text-(--muted-foreground) cursor-pointer">
          Acepto los{' '}
          <Link href="/terminos" className="text-(--primary) hover:underline">Términos y Condiciones</Link>
          {' '}y la{' '}
          <Link href="/privacidad" className="text-(--primary) hover:underline">Política de Privacidad</Link>
        </label>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
          Atrás
        </Button>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="flex-1"
          disabled={loading || !formData.email || !formData.password || !formData.aceptaTerminos || passwordError !== null || !passwordsMatch}
        >
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </Button>
      </div>
    </div>
    );
  };

  const renderStep3 = () => (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="w-20 h-20 mx-auto rounded-full bg-(--success)/10 flex items-center justify-center">
        <Mail className="w-10 h-10 text-(--success)" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-(--foreground) mb-2">¡Verifica tu correo!</h3>
        <p className="text-(--muted-foreground)">
          Hemos enviado un código de verificación a<br />
          <span className="font-medium text-(--foreground)">{formData.email}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-(--destructive)/10 border border-(--destructive)/20 rounded-lg text-(--destructive) text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label>Código de Verificación (6 dígitos)</Label>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verificationCode[i]}
              onChange={(e) => handleVerificationCodeChange(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !verificationCode[i] && i > 0) {
                  const prevInput = document.getElementById(`code-${i - 1}`);
                  prevInput?.focus();
                }
              }}
              disabled={loading}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-(--input) bg-(--background) focus:border-(--primary) focus:ring-2 focus:ring-(--ring) disabled:opacity-50"
            />
          ))}
        </div>
        <p className="text-xs text-(--muted-foreground)">El código expira en 15 minutos</p>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        onClick={handleVerifyCode}
        disabled={loading || verificationCode.join('').length !== 6}
      >
        {loading ? 'Verificando...' : 'Verificar Cuenta'}
        <CheckCircle className="w-5 h-5" />
      </Button>

      <button
        type="button"
        className="text-sm text-(--primary) hover:underline disabled:opacity-50"
        onClick={handleResendCode}
        disabled={loading || verificationAttempts <= 0}
      >
        Reenviar código ({verificationAttempts} intentos restantes)
      </button>
    </div>
  );

  return (
    <>
      {step < 3 && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-(--foreground) mb-2">Crear Cuenta</h2>
            <p className="text-(--muted-foreground)">Únete a la comunidad WasiGo</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                  ? 'bg-(--primary) text-(--primary-foreground)'
                  : 'bg-(--muted) text-(--muted-foreground)'
                  }`}>
                  {s}
                </div>
                {s < 2 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-(--primary)' : 'bg-(--muted)'}`} />}
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <form onSubmit={step === 2 ? handleStep2Submit : (e) => e.preventDefault()}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>

      {step < 3 && (
        <div className="mt-6 text-center">
          <p className="text-(--muted-foreground)">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-(--primary) font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
