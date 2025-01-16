"use client";

import { useState, useEffect, useMemo } from "react";
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
import FallbackSpinner from "@/components/ui/spinner";

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
  idTipoLlamado: number;
  nombreTipoLlamado: string;
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
  const [selectedTipoLlamado, setSelectedTipoLlamado] = useState<string | null>(
    "1ra Alarma de Incendio"
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [clavesResponse, voluntariosResponse, tipoCitacionResponse] =
          await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`,
              {
                headers: {
                  "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true",
                },
              }
            ),
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
          !clavesResponse.ok ||
          !voluntariosResponse.ok ||
          !tipoCitacionResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }
        const clavesData = await clavesResponse.json();
        const voluntariosData = await voluntariosResponse.json();
        const tipoCitacionData = await tipoCitacionResponse.json();
        const parsedClavesData = Array.isArray(clavesData) ? clavesData : [];
        const parsedVoluntariosData = Array.isArray(voluntariosData)
          ? voluntariosData
          : [];
        const parsedTipoCitacionData = Array.isArray(tipoCitacionData)
          ? tipoCitacionData
          : [];
        console.log(parsedTipoCitacionData);
        setClavesEmergencia(parsedClavesData);
        setVoluntarios(parsedVoluntariosData);
        setTipoCitacion(parsedTipoCitacionData);
        setSummaryStats({
          totalAsistencias: 0, // Will be updated by the filtered fetch
          totalEmergencias: 0, // Will be updated by the filtered fetch
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

  const createDateRangeQueryString = (
    fromDate: Date | null,
    toDate: Date | null
  ): string => {
    const formatDate = (date: Date): string => {
      return date.toISOString().split("T")[0]; // This gives us 'yyyy-mm-dd'
    };

    let queryString = "";

    if (fromDate) {
      queryString += `fechaInicio=${formatDate(fromDate)}`;
    }

    if (toDate) {
      if (queryString) queryString += "&";
      queryString += `fechaFin=${formatDate(toDate)}`;
    }

    return queryString;
  };

  const createApiUrl = (
    baseUrl: string,
    fromDate: Date | null,
    toDate: Date | null,
    tipoLlamado: string | null
  ) => {
    const dateRangeQuery = createDateRangeQueryString(fromDate, toDate);
    if (selectedTipoLlamado != null) {
      tipoLlamado = `&tipoLlamado=${selectedTipoLlamado}`;
    } else {
      tipoLlamado = "";
    }

    const tipoLlamadoQuery = tipoLlamado;
    // if
    return `${baseUrl}?${dateRangeQuery}${tipoLlamadoQuery}`;
  };
  const createApiUrlEmergencia = (
    baseUrl: string,
    fromDate: Date | null,
    toDate: Date | null
  ) => {
    const dateRangeQuery = createDateRangeQueryString(fromDate, toDate);
    return `${baseUrl}?${dateRangeQuery}`;
  };

  const filterDataByDateRange = (
    data: ParteAsistencia[] | ParteEmergencia[],
    dateField: "fechaAsistencia" | "fechaEmergencia"
  ) => {
    const queryString = createDateRangeQueryString(
      fromDate || null,
      toDate || null
    );

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

  useEffect(() => {
    const fetchDataByTipoLlamado = async () => {
      setLoading(true);
      try {
        const asistenciaUrl = createApiUrl(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/fechas-tipo`,
          fromDate || null,
          toDate || null,
          selectedTipoLlamado
        );
        const response = await fetch(asistenciaUrl, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data);
        setPartesAsistencia(Array.isArray(data) ? data : []);
        setSummaryStats((prevStats) => ({
          ...prevStats,
          totalAsistencias: Array.isArray(data) ? data.length : 0,
        }));
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataByTipoLlamado();
  }, [fromDate, toDate, selectedTipoLlamado]);

  useEffect(() => {
    const fetchEmergenciaData = async () => {
      setLoading(true);
      try {
        const emergenciaUrl = createApiUrlEmergencia(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/fechas-simple`,
          fromDate || null,
          toDate || null
        );
        const response = await fetch(emergenciaUrl, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch emergencia data");
        }
        const data = await response.json();
        setPartesEmergencia(Array.isArray(data) ? data : []);
        setSummaryStats((prevStats) => ({
          ...prevStats,
          totalEmergencias: Array.isArray(data) ? data.length : 0,
        }));
      } catch (err) {
        setError("Error fetching emergencia data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergenciaData();
  }, [fromDate, toDate]);

  const tipoLlamadoColors = useMemo(() => {
    const uniqueTipos = [...new Set(filteredPartesAsistencia.map(parte => parte.nombreTipoLlamado))];
    return Object.fromEntries(uniqueTipos.map((tipo, index) => [tipo, COLORS[index % COLORS.length]]));
  }, [filteredPartesAsistencia])
  
  if (loading) return <FallbackSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  const asistenciaChartData = filteredPartesAsistencia
    .sort(
      (a, b) =>
        new Date(a.fechaAsistencia).getTime() -
        new Date(b.fechaAsistencia).getTime()
    )
    .slice(-10)
    .map((parte) => ({
      folio: parte.folioPAsistencia,
      asistencia: parte.totalAsistencia,
      fecha: new Date(parte.fechaAsistencia).toLocaleDateString(),
      tipoLlamado:
        tipoCitacion.find((tipo) => tipo.idTipoLlamado === parte.idTipoLlamado)
          ?.nombreTipoLlamado || "Desconocido",
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

              <select
                value={selectedTipoLlamado?.toString() || ""}
                onChange={(e) => setSelectedTipoLlamado(e.target.value || null)}
                className="border-2 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Todos los tipos de llamado</option>
                {tipoCitacion.map((tipo) => (
                  <option
                    key={tipo.nombreTipoLlamado}
                    value={tipo.nombreTipoLlamado}
                  >
                    {tipo.nombreTipoLlamado}
                  </option>
                ))}
              </select>
              <Button onClick={setLastWeek}>Última semana</Button>
              <Button onClick={setLastMonth}>Último mes</Button>
              <Button onClick={setLastYear}>Último año</Button>
            </div>
          </div>
        </CardHeader>
        <Tabs defaultValue="asistencia">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
            <TabsTrigger value="emergencias">Emergencias</TabsTrigger>
          </TabsList>
          <TabsContent value="asistencia">
            <Card>
              <CardHeader>
                <CardTitle>Reporte de Partes de Asistencias</CardTitle>
                <CardDescription>
                  Total de voluntarios asistentes por partes a través de las
                  citaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Asistencia por Folio</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      {asistenciaChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={asistenciaChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="folio"
                              label={{
                                value: "Folio de asistencias",
                                position: "insideBottom",
                                offset: -10,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Total Asistencia",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
                                      <p className="font-bold">
                                        Fecha: {label}
                                      </p>
                                      <p>Folio: {payload[0].payload.folio}</p>
                                      <p>Asistencia: {payload[0].value}</p>
                                      <p>
                                        Tipo: {payload[0].payload.tipoLlamado}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend />
                            <Bar
                              dataKey="asistencia"
                              fill="#8884d8"
                              name={
                                tipoCitacion
                                  ? tipoCitacion.find(
                                      (tipo) =>
                                        tipo.nombreTipoLlamado ===
                                        selectedTipoLlamado?.nombreTipoLlamado
                                    )?.nombreTipoLlamado
                                  : "Todos los tipos"
                              }
                            >
                              {asistenciaChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Bar>
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
          
          <TabsContent value="emergencias">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Grafica por Partes de Emergencias</CardTitle>
                      <CardDescription>
                        Distribución por claves de emergencias
                      </CardDescription>
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
                            <TableHead>Cantidad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {emergenciaChartData.map((clave, index) => (
                            <TableRow key={index}>
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
        </Tabs>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de voluntarios por Compañía</CardTitle>
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
    </div>
  );
}
