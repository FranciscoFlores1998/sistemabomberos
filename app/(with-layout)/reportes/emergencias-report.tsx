'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

interface ParteEmergencia {
  folioPEmergencia: number;
  fechaEmergencia: string;
  horaInicio: string;
  horaFin: string;
  direccionEmergencia: string;
  idClaveEmergencia: number;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

interface EmergenciasReportProps {
  onDataLoad: (total: number) => void;
}

export function EmergenciasReport({ onDataLoad }: EmergenciasReportProps) {
  const [partesEmergencia, setPartesEmergencia] = useState<ParteEmergencia[]>([])
  const [clavesEmergencia, setClavesEmergencia] = useState<ClaveEmergencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partesResponse, clavesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })
        ])

        if (!partesResponse.ok || !clavesResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const partesData = await partesResponse.json()
        const clavesData = await clavesResponse.json()

        const parsedPartesData = Array.isArray(partesData) ? partesData : []
        const parsedClavesData = Array.isArray(clavesData) ? clavesData : []

        setPartesEmergencia(parsedPartesData)
        setClavesEmergencia(parsedClavesData)
        
        // Send total to parent
        onDataLoad(parsedPartesData.length)
      } catch (err) {
        setError('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [onDataLoad])

  if (loading) return <p>Cargando datos de emergencias...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const emergenciasPorClave = partesEmergencia.reduce((acc, parte) => {
    if (parte && parte.idClaveEmergencia) {
      acc[parte.idClaveEmergencia] = (acc[parte.idClaveEmergencia] || 0) + 1
    }
    return acc
  }, {} as Record<number, number>)

  const chartData = Object.entries(emergenciasPorClave).map(([idClave, count]) => ({
    name: clavesEmergencia.find(clave => clave.idClaveEmergencia === parseInt(idClave))?.nombreClaveEmergencia || 'Desconocido',
    value: count
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Emergencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total de partes de emergencia: {partesEmergencia.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Emergencias por Clave</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos suficientes para mostrar el gráfico.</p>
          )}
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora Inicio</TableHead>
            <TableHead>Hora Fin</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Clave</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partesEmergencia.slice(0, 5).map((parte) => (
            <TableRow key={parte.folioPEmergencia}>
              <TableCell>{parte.folioPEmergencia}</TableCell>
              <TableCell>{parte.fechaEmergencia}</TableCell>
              <TableCell>{parte.horaInicio}</TableCell>
              <TableCell>{parte.horaFin}</TableCell>
              <TableCell>{parte.direccionEmergencia}</TableCell>
              <TableCell>
                {clavesEmergencia.find(clave => clave.idClaveEmergencia === parte.idClaveEmergencia)?.nombreClaveEmergencia || 'Desconocido'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

