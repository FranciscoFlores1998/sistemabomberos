"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { addDays, subDays, subMonths, subYears, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";

interface SummaryStats {
  totalAsistencias: number;
  totalEmergencias: number;
  totalVoluntarios: number;
  totalCitaciones: number;
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

interface TipoCitacion {
  idTipoCitacion: number;
  nombreTipoCitacion: string;
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ReportesPage() {
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalAsistencias: 0,
    totalEmergencias: 0,
    totalVoluntarios: 0,
    totalCitaciones: 0,
  });
  const [partesAsistencia, setPartesAsistencia] = useState<ParteAsistencia[]>(
    []
  );
  const [partesEmergencia, setPartesEmergencia] = useState<ParteEmergencia[]>(
    []
  );
  const [clavesEmergencia, setClavesEmergencia] = useState<ClaveEmergencia[]>(
    []
  );
  const [tipoCitacion, setTipoCitacion] = useState<TipoCitacion[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    subMonths(new Date(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          asistenciaResponse,
          emergenciaResponse,
          clavesResponse,
          voluntariosResponse,
          tipoCitacionResponse,
        ] = await Promise.all([
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
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
        ]);

        if (
          !asistenciaResponse.ok ||
          !emergenciaResponse.ok ||
          !clavesResponse.ok ||
          !voluntariosResponse.ok ||
          !tipoCitacionResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const asistenciaData = await asistenciaResponse.json();
        const emergenciaData = await emergenciaResponse.json();
        const clavesData = await clavesResponse.json();
        const voluntariosData = await voluntariosResponse.json();
        const tipoCitacionData = await tipoCitacionResponse.json();

        const parsedAsistenciaData = Array.isArray(asistenciaData)
          ? asistenciaData
          : [];
        const parsedEmergenciaData = Array.isArray(emergenciaData)
          ? emergenciaData
          : [];
        const parsedClavesData = Array.isArray(clavesData) ? clavesData : [];
        const parsedVoluntariosData = Array.isArray(voluntariosData)
          ? voluntariosData
          : [];
        const parsedTipoCitacionData = Array.isArray(tipoCitacionData)
          ? tipoCitacionData
          : [];

        setPartesAsistencia(parsedAsistenciaData);
        setPartesEmergencia(parsedEmergenciaData);
        setClavesEmergencia(parsedClavesData);
        setVoluntarios(parsedVoluntariosData);
        setTipoCitacion(parsedTipoCitacionData);

        setSummaryStats({
          totalAsistencias: parsedAsistenciaData.length,
          totalEmergencias: parsedEmergenciaData.length,
          totalVoluntarios: parsedVoluntariosData.length,
          totalCitaciones: parsedTipoCitacionData.length,
        });
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterDataByDateRange = (
    data: ParteAsistencia[] | ParteEmergencia[],
    dateField: "fechaAsistencia" | "fechaEmergencia"
  ) => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return (
        (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate)
      );
    });
  };

  const filteredPartesAsistencia = filterDataByDateRange(
    partesAsistencia,
    "fechaAsistencia"
  );
  const filteredPartesEmergencia = filterDataByDateRange(
    partesEmergencia,
    "fechaEmergencia"
  );

  const setLastWeek = () => {
    const today = new Date();
    setFromDate(startOfDay(subDays(today, 7)));
    setToDate(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    setFromDate(startOfDay(subMonths(today, 1)));
    setToDate(today);
  };

  const setLastYear = () => {
    const today = new Date();
    setFromDate(startOfDay(subYears(today, 1)));
    setToDate(today);
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const asistenciaChartData = filteredPartesAsistencia
    .filter(
      (parte) => parte.fechaAsistencia && parte.totalAsistencia !== undefined
    )
    .sort(
      (a, b) =>
        new Date(a.fechaAsistencia).getTime() -
        new Date(b.fechaAsistencia).getTime()
    )
    .slice(-10)
    .map((parte) => ({
      fecha: parte.fechaAsistencia,
      asistencia: parte.totalAsistencia,
    }));

  const emergenciasPorClave = filteredPartesEmergencia.reduce((acc, parte) => {
    if (parte && parte.idClaveEmergencia) {
      acc[parte.idClaveEmergencia] = (acc[parte.idClaveEmergencia] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const emergenciaChartData = Object.entries(emergenciasPorClave).map(
    ([idClave, count]) => ({
      name:
        clavesEmergencia.find(
          (clave) => clave.idClaveEmergencia === parseInt(idClave)
        )?.nombreClaveEmergencia || "Desconocido",
      value: count,
    })
  );

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
      <h1 className="text-3xl font-bold mb-6">Panel de Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Total de Partes de Asistencias: {partesAsistencia.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Total de Partes de Emergencias: {partesEmergencia.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen General</CardTitle>
          <CardDescription>
            Gráfico comparativo de totales actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  totalAsistencias: partesAsistencia.length,
                  totalEmergencias: partesEmergencia.length,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalAsistencias"
                name="Asistencias"
                fill="#8884d8"
              />
              <Bar
                dataKey="totalEmergencias"
                name="Emergencias"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Filtrar por fecha</h2>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4">
              <DatePickerWithRange
                fromDate={fromDate}
                toDate={toDate}
                onFromChange={setFromDate}
                onToChange={setToDate}
              />
              <Button onClick={setLastWeek}>Última semana</Button>
              <Button onClick={setLastMonth}>Último mes</Button>
              <Button onClick={setLastYear}>Último año</Button>
            </div>
          </div>
        </CardHeader>
        <Tabs defaultValue="asistencia">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
            <TabsTrigger value="emergencias">Emergencias</TabsTrigger>
            <TabsTrigger value="voluntarios">Voluntarios</TabsTrigger>
          </TabsList>

          <TabsContent value="asistencia">
            <Card>
              <CardHeader>
                <CardTitle>Reporte de Partes de Asistencias</CardTitle>
                <CardDescription>
                  Resumen detallado de la asistencia del personal
                </CardDescription>
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
                            <Line
                              type="monotone"
                              dataKey="asistencia"
                              stroke="#8884d8"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p>No hay datos suficientes para mostrar el gráfico.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergencias">
            <Card>
              <CardHeader>
                <CardTitle>Reporte de Partes de Emergencias</CardTitle>
                <CardDescription>
                  Análisis de las emergencias atendidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Distribución de Emergencias por Clave
                      </CardTitle>
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
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Lista de Claves de Emergencias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Clave</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Cantidad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {emergenciaChartData.map((clave, index) => (
                            <TableRow key={index}>
                              <TableCell>{clave.name}</TableCell>
                              <TableCell>{clave.name}</TableCell>
                              <TableCell>{clave.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voluntarios">
            <Card>
              <CardHeader>
                <CardTitle>Reporte de Voluntarios</CardTitle>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
