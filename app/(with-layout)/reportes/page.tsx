'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AsistenciaReport } from "./asistencia-report"
import { EmergenciasReport } from "./emergencias-report"


export default function ReportesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Panel de Reportes</h1>
      <Tabs defaultValue="voluntarios">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          <TabsTrigger value="emergencias">Emergencias</TabsTrigger>
        </TabsList>


        <TabsContent value="asistencia">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia</CardTitle>
              <CardDescription>Resumen de la asistencia del personal</CardDescription>
            </CardHeader>
            <CardContent>
              <AsistenciaReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emergencias">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Emergencias</CardTitle>
              <CardDescription>Resumen de las emergencias atendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <EmergenciasReport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

