'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  rutVoluntario: string;
  claveRadial: string;
  idCargo: number;
  idCompania: string;
}

export function VoluntariosReport() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch volunteers')
        }
        const data = await response.json()
        setVoluntarios(data)
      } catch (err) {
        setError('Error fetching volunteers data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVoluntarios()
  }, [])

  if (loading) return <p>Cargando datos de voluntarios...</p>
  if (error) return <p className="text-red-500">{error}</p>

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Clave Radial</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voluntarios.slice(0, 5).map((voluntario) => (
            <TableRow key={voluntario.idVoluntario}>
              <TableCell>{voluntario.nombreVol}</TableCell>
              <TableCell>{voluntario.rutVoluntario}</TableCell>
              <TableCell>{voluntario.claveRadial}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

