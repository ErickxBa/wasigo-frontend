import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Car, Users, Shield, MapPin, Clock, Star,
  ChevronRight, CreditCard, MessageCircle,
  CheckCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  const features = [
    {
      icon: Car,
      title: 'Viajes Compartidos',
      description: 'Comparte gastos de transporte con compañeros de tu universidad de forma segura.'
    },
    {
      icon: Shield,
      title: 'Comunidad Verificada',
      description: 'Solo estudiantes y personal universitario con correo institucional verificado.'
    },
    {
      icon: CreditCard,
      title: 'Pagos Seguros',
      description: 'Múltiples métodos de pago: PayPal, tarjeta o efectivo.'
    },
    {
      icon: MessageCircle,
      title: 'Chat en Tiempo Real',
      description: 'Coordina con tu conductor y compañeros de viaje fácilmente.'
    },
  ];

  const stats = [
    { value: '2,500+', label: 'Usuarios Activos' },
    { value: '15,000+', label: 'Viajes Completados' },
    { value: '4.8', label: 'Calificación Promedio' },
    { value: '$45K', label: 'Ahorro Total' },
  ];

  const steps = [
    { step: 1, title: 'Regístrate', description: 'Usa tu correo institucional para crear tu cuenta' },
    { step: 2, title: 'Busca o Publica', description: 'Encuentra rutas disponibles o crea las tuyas' },
    { step: 3, title: 'Confirma y Viaja', description: 'Reserva tu asiento y disfruta el viaje' },
  ];

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-(--background)/80 backdrop-blur-lg border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                <Car className="w-6 h-6 text-(--primary-foreground)" />
              </div>
              <span className="text-xl font-bold text-(--foreground)">WasiGo</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className='cursor-pointer'>Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button className='cursor-pointer'>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-(--primary)/5 via-transparent to-(--primary)/10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-(--primary)/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-(--primary)/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-(--primary)/10 rounded-full text-(--primary) text-sm font-medium">
                <Star className="w-4 h-4" />
                La app de carpooling universitario #1
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-(--foreground) leading-tight">
                Comparte el viaje,
                <span className="text-(--primary) block">divide los gastos</span>
              </h1>

              <p className="text-lg text-(--muted-foreground) max-w-lg">
                Conecta con estudiantes de tu universidad que van en tu misma dirección.
                Ahorra dinero, reduce tu huella de carbono y haz nuevos amigos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-(--primary) to-(--primary)/60 border-2 border-(--background) flex items-center justify-center text-(--primary-foreground) text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-(--foreground)">+2,500 estudiantes</p>
                  <p className="text-xs text-(--muted-foreground)">ya usan WasiGo</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-(--card) to-(--muted) rounded-3xl p-8 shadow-custom-xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-(--primary)/20 rounded-full blur-2xl" />

                {/* Mock App Screen */}
                <div className="bg-(--background) rounded-2xl p-6 space-y-4 shadow-custom-lg">
                  <div className="flex items-center gap-3 pb-4 border-b border-(--border)">
                    <MapPin className="w-5 h-5 text-(--primary)" />
                    <div>
                      <p className="text-xs text-(--muted-foreground)">Desde</p>
                      <p className="font-medium text-(--foreground)">Campus Principal EPN</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { time: '17:30', dest: 'La Carolina', seats: 2, price: '$2.50' },
                      { time: '18:00', dest: 'Iñaquito', seats: 3, price: '$2.00' },
                      { time: '19:00', dest: 'Carcelén', seats: 4, price: '$3.00' },
                    ].map((route, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-(--muted)/50 rounded-xl hover:bg-(--muted) transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-(--primary)/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-(--primary)" />
                          </div>
                          <div>
                            <p className="font-medium text-(--foreground)">{route.time}</p>
                            <p className="text-sm text-(--muted-foreground)">{route.dest}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-(--primary)">{route.price}</p>
                          <p className="text-xs text-(--muted-foreground)">{route.seats} asientos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-(--muted)/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-(--primary)">{stat.value}</p>
                <p className="text-(--muted-foreground) mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-(--foreground)">
              Todo lo que necesitas para
              <span className="text-(--primary)"> viajar mejor</span>
            </h2>
            <p className="mt-4 text-lg text-(--muted-foreground) max-w-2xl mx-auto">
              WasiGo está diseñado específicamente para la comunidad universitaria,
              con características que hacen tus viajes más seguros y económicos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="group hover:shadow-custom-lg transition-all hover:-translate-y-1 border-(--border)/50">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-(--primary)/10 rounded-xl flex items-center justify-center group-hover:bg-(--primary)/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-(--primary)" />
                  </div>
                  <h3 className="text-lg font-semibold text-(--foreground)">{feature.title}</h3>
                  <p className="text-(--muted-foreground) text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-(--muted)/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-(--foreground)">
              Comienza en <span className="text-(--primary)">3 simples pasos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-(--primary) text-(--primary-foreground) rounded-2xl flex items-center justify-center text-2xl font-bold shadow-custom-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-(--foreground)">{item.title}</h3>
                  <p className="text-(--muted-foreground)">{item.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-(--muted-foreground)/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Passenger */}
            <Card className="overflow-hidden border-(--border)/50">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-(--info)/10 to-(--info)/5 p-8">
                  <div className="w-16 h-16 bg-(--info)/20 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-(--info)" />
                  </div>
                  <h3 className="text-2xl font-bold text-(--foreground) mb-4">Para Pasajeros</h3>
                  <ul className="space-y-3">
                    {[
                      'Encuentra rutas que se ajusten a tu horario',
                      'Reserva con un solo clic',
                      'Paga de forma segura',
                      'Califica y recibe calificaciones'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-(--muted-foreground)">
                        <CheckCircle className="w-5 h-5 text-(--info) shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Driver */}
            <Card className="overflow-hidden border-(--border)/50">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-(--success)/10 to-(--success)/5 p-8">
                  <div className="w-16 h-16 bg-(--success)/20 rounded-2xl flex items-center justify-center mb-6">
                    <Car className="w-8 h-8 text-(--success)" />
                  </div>
                  <h3 className="text-2xl font-bold text-(--foreground) mb-4">Para Conductores</h3>
                  <ul className="space-y-3">
                    {[
                      'Publica tus rutas en segundos',
                      'Gana dinero compartiendo tu viaje',
                      'Retiros fáciles vía PayPal',
                      'Tú decides cuántos pasajeros llevas'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-(--muted-foreground)">
                        <CheckCircle className="w-5 h-5 text-(--success) shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-(--primary) to-(--primary)/80 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <CardContent className="p-8 sm:p-12 text-center relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-(--primary-foreground) mb-4">
                ¿Listo para empezar a ahorrar?
              </h2>
              <p className="text-(--primary-foreground)/80 text-lg mb-8 max-w-2xl mx-auto">
                Únete a miles de estudiantes que ya viajan de forma más inteligente.
                Regístrate gratis y comienza hoy.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Crear mi cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-(--border)">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center">
                <Car className="w-5 h-5 text-(--primary-foreground)" />
              </div>
              <span className="font-bold text-(--foreground)">WasiGo</span>
            </div>
            <p className="text-sm text-(--muted-foreground)">
              © 2025 WasiGo. Proyecto universitario EPN.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
