'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface ParteAsistencia {
  folioPAsistencia: number;
  fechaAsistencia: string;
  totalAsistencia: number;
  idTipoLlamado: number;
}

export function AsistenciaReport() {
  const [partesAsistencia, setPartesAsistencia] = useState<ParteAsistencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPartesAsistencia = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch attendance reports')
        }
        const data = await response.json()
        setPartesAsistencia(Array.isArray(data) ? data : [])
      } catch (err) {
        setError('Error fetching attendance reports data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartesAsistencia()
  }, [])

  if (loading) return <p>Cargando datos de asistencia...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const totalAsistencias = partesAsistencia.reduce((sum, parte) => sum + (parte.totalAsistencia || 0), 0)

  const chartData = partesAsistencia
    .filter(parte => parte.fechaAsistencia && parte.totalAsistencia !== undefined)
    .sort((a, b) => new Date(a.fechaAsistencia).getTime() - new Date(b.fechaAsistencia).getTime())
    .slice(-10)
    .map(parte => ({
      fecha: parte.fechaAsistencia,
      asistencia: parte.totalAsistencia
    }))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total de partes de asistencia: {partesAsistencia.length}</p>
          <p>Total de asistencias: {totalAsistencias}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Asistencia</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="asistencia" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos suficientes para mostrar el gráfico.</p>
          )}
        </CardContent>
      </Card>
      
    </div>
  )
}

