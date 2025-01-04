import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Bomberos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Bienvenido al Sistema de Bomberos. Este sistema está diseñado para ayudar en la gestión y
              coordinación de las actividades del cuerpo de bomberos. Aquí encontrará herramientas para
              el manejo de emergencias, inventario de equipos y programación de turnos.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimas Actualizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              - Se ha implementado un nuevo módulo de gestión de inventario.<br />
              - Se ha mejorado el sistema de alertas para emergencias.<br />
              - Se ha actualizado el calendario de turnos para mayor flexibilidad.<br />
              - Se han añadido nuevos reportes estadísticos.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

