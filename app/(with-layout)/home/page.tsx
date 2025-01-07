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
              Bienvenido al Sistema de Bomberos. 
              Este sistema está diseñado para ayudar en la gestión y
              coordinación de las actividades del cuerpo de bomberos. 
              Aquí encontrará un apoyo digital para la administración de los partes de asistencia y emergencias.
              
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimas Actualizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              - Se han añadido nuevos reportes estadísticos.<br />
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

