'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface SummaryStats {
  totalAsistencias: number;
  totalEmergencias: number;
  totalVoluntarios: number;
}

interface ParteAsistencia {
  folioPAsistencia: number;
  fechaAsistencia: string;
  totalAsistencia: number;
  idTipoLlamado: number;
}

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

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  rutVoluntario: string;
  claveRadial: string;
  idCargo: number;
  idCompania: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportesPage() {
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalAsistencias: 0,
    totalEmergencias: 0,
    totalVoluntarios: 0,
  })
  const [partesAsistencia, setPartesAsistencia] = useState<ParteAsistencia[]>([])
  const [partesEmergencia, setPartesEmergencia] = useState<ParteEmergencia[]>([])
  const [clavesEmergencia, setClavesEmergencia] = useState<ClaveEmergencia[]>([])
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [asistenciaResponse, emergenciaResponse, clavesResponse, voluntariosResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
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
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })
        ])

        if (!asistenciaResponse.ok || !emergenciaResponse.ok || !clavesResponse.ok || !voluntariosResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const asistenciaData = await asistenciaResponse.json()
        const emergenciaData = await emergenciaResponse.json()
        const clavesData = await clavesResponse.json()
        const voluntariosData = await voluntariosResponse.json()

        const parsedAsistenciaData = Array.isArray(asistenciaData) ? asistenciaData : []
        const parsedEmergenciaData = Array.isArray(emergenciaData) ? emergenciaData : []
        const parsedClavesData = Array.isArray(clavesData) ? clavesData : []
        const parsedVoluntariosData = Array.isArray(voluntariosData) ? voluntariosData : []

        setPartesAsistencia(parsedAsistenciaData)
        setPartesEmergencia(parsedEmergenciaData)
        setClavesEmergencia(parsedClavesData)
        setVoluntarios(parsedVoluntariosData)

        //const totalAsistencias = parsedAsistenciaData.reduce((sum, parte) => sum + (parte.totalAsistencia || 0), 0)
        setSummaryStats({
          totalAsistencias: parsedAsistenciaData.length, 
          totalEmergencias: parsedEmergenciaData.length,
          totalVoluntarios: parsedVoluntariosData.length,
        })
      } catch (err) {
        setError('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Cargando datos...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const dummyData = [
    { name: 'Ene', asistencias: 40, emergencias: 24, voluntarios: 98 },
    { name: 'Feb', asistencias: 30, emergencias: 13, voluntarios: 85 },
    { name: 'Mar', asistencias: 20, emergencias: 38, voluntarios: 107 },
    { name: 'Abr', asistencias: 27, emergencias: 39, voluntarios: 112 },
    { name: 'May', asistencias: 18, emergencias: 48, voluntarios: 95 },
    { name: 'Jun', asistencias: 23, emergencias: 38, voluntarios: 103 },
  ];

  const asistenciaChartData = partesAsistencia
    .filter(parte => parte.fechaAsistencia && parte.totalAsistencia !== undefined)
    .sort((a, b) => new Date(a.fechaAsistencia).getTime() - new Date(b.fechaAsistencia).getTime())
    .slice(-10)
    .map(parte => ({
      fecha: parte.fechaAsistencia,
      asistencia: parte.totalAsistencia
    }))

  const emergenciasPorClave = partesEmergencia.reduce((acc, parte) => {
    if (parte && parte.idClaveEmergencia) {
      acc[parte.idClaveEmergencia] = (acc[parte.idClaveEmergencia] || 0) + 1
    }
    return acc
  }, {} as Record<number, number>)

  const emergenciaChartData = Object.entries(emergenciasPorClave).map(([idClave, count]) => ({
    name: clavesEmergencia.find(clave => clave.idClaveEmergencia === parseInt(idClave))?.nombreClaveEmergencia || 'Desconocido',
    value: count
  }))

  const voluntariosPorCompania = voluntarios.reduce((acc, voluntario) => {
    const compania = voluntario.idCompania || "Sin Compañía";
    acc[compania] = (acc[compania] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const voluntariosChartData = Object.entries(voluntariosPorCompania).map(
    ([compania, cantidad]) => ({
      compania: `Compañía ${compania}`,
      cantidad,
    })
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Panel de Reportes Unificado</h1>
      
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen General</CardTitle>
          <CardDescription>Gráfico comparativo de los últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="asistencias" fill="#8884d8" />
              <Bar dataKey="emergencias" fill="#82ca9d" />
              <Bar dataKey="voluntarios" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
              <CardDescription>Resumen detallado de la asistencia del personal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendencia de Asistencia</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {asistenciaChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={asistenciaChartData}>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Total Asistencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partesAsistencia.slice(0, 5).map((parte) => (
                      <TableRow key={parte.folioPAsistencia}>
                        <TableCell>{parte.folioPAsistencia}</TableCell>
                        <TableCell>{parte.fechaAsistencia}</TableCell>
                        <TableCell>{parte.totalAsistencia}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergencias">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Emergencias</CardTitle>
              <CardDescription>Análisis de las emergencias atendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Emergencias por Clave</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {emergenciaChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={emergenciaChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {emergenciaChartData.map((entry, index) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voluntarios">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Voluntarios</CardTitle>
              <CardDescription>Estadísticas de los voluntarios registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Compañía</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {voluntariosChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={voluntariosChartData}>
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
                      <TableHead>Compañía</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voluntarios.slice(0, 5).map((voluntario) => (
                      <TableRow key={voluntario.idVoluntario}>
                        <TableCell>{voluntario.nombreVol}</TableCell>
                        <TableCell>{voluntario.rutVoluntario}</TableCell>
                        <TableCell>{voluntario.claveRadial}</TableCell>
                        <TableCell>Compañía {voluntario.idCompania}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

