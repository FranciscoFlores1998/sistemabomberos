'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  rutVoluntario: string;
  claveRadial: string;
  idCargo: number;
  idCompania: string;
}

interface Cargo {
  idCargo: number;
  nombreCargo: string;
}

interface VoluntariosReportProps {
  onDataLoad: (total: number) => void;
}

export function VoluntariosReport({ onDataLoad }: VoluntariosReportProps) {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [voluntariosResponse, cargosResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cargo/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })
        ])

        if (!voluntariosResponse.ok || !cargosResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const voluntariosData = await voluntariosResponse.json()
        const cargosData = await cargosResponse.json()

        const parsedVoluntariosData = Array.isArray(voluntariosData) ? voluntariosData : []
        const parsedCargosData = Array.isArray(cargosData) ? cargosData : []

        setVoluntarios(parsedVoluntariosData)
        setCargos(parsedCargosData)
        
        // Send total to parent
        onDataLoad(parsedVoluntariosData.length)
      } catch (err) {
        setError('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [onDataLoad])

  if (loading) return <p>Cargando datos de voluntarios...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const voluntariosPorCompania = voluntarios.reduce((acc, voluntario) => {
    const compania = voluntario.idCompania || 'Sin Compañía'
    acc[compania] = (acc[compania] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(voluntariosPorCompania).map(([compania, cantidad]) => ({
    compania: `Compañía ${compania}`,
    cantidad
  }))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Voluntarios</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total de voluntarios: {voluntarios.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Compañía</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="compania" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos suficientes para mostrar el gráfico.</p>
          )}
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Clave Radial</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Compañía</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voluntarios.slice(0, 5).map((voluntario) => (
            <TableRow key={voluntario.idVoluntario}>
              <TableCell>{voluntario.nombreVol}</TableCell>
              <TableCell>{voluntario.rutVoluntario}</TableCell>
              <TableCell>{voluntario.claveRadial}</TableCell>
              <TableCell>
                {cargos.find(cargo => cargo.idCargo === voluntario.idCargo)?.nombreCargo || 'Sin Cargo'}
              </TableCell>
              <TableCell>Compañía {voluntario.idCompania}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

