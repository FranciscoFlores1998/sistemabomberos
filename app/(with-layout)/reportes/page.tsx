'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AsistenciaReport } from "./asistencia-report"
import { EmergenciasReport } from "./emergencias-report"
import { VoluntariosReport } from "./voluntarios-report"

interface SummaryStats {
  totalAsistencias: number;
  totalEmergencias: number;
  totalVoluntarios: number;
}

export default function ReportesPage() {
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalAsistencias: 0,
    totalEmergencias: 0,
    totalVoluntarios: 0,
  })

  const updateStats = (type: keyof SummaryStats, value: number) => {
    setSummaryStats(prev => ({
      ...prev,
      [type]: value
    }))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Panel de Reportes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Asistencias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryStats.totalAsistencias}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Emergencias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryStats.totalEmergencias}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Voluntarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryStats.totalVoluntarios}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="asistencia">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          <TabsTrigger value="emergencias">Emergencias</TabsTrigger>
          <TabsTrigger value="voluntarios">Voluntarios</TabsTrigger>
        </TabsList>

        <TabsContent value="asistencia">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia</CardTitle>
              <CardDescription>Resumen de la asistencia del personal</CardDescription>
            </CardHeader>
            <CardContent>
              <AsistenciaReport onDataLoad={(total) => updateStats('totalAsistencias', total)} />
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
              <EmergenciasReport onDataLoad={(total) => updateStats('totalEmergencias', total)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voluntarios">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Voluntarios</CardTitle>
              <CardDescription>Resumen de los voluntarios registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <VoluntariosReport onDataLoad={(total) => updateStats('totalVoluntarios', total)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
