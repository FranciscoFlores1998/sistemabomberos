"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datepicker";
import { toast } from "@/components/ui/use-toast";
import { formatearFecha } from "@/lib/formatearFecha";

interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}

interface ParteAsistenciaData {
  folioPAsistencia: number;
  aCargoDelCuerpo: string;
  aCargoDeLaCompania: string;
  fechaAsistencia: string;
  horaInicio: string;
  horaFin: string;
  direccionAsistencia: string;
  totalAsistencia: number;
  observaciones: string;
  idTipoLlamado: number;
}

export default function EditarParteAsistencia() {
  const router = useRouter();
  const [parteAsistencia, setParteAsistencia] = useState<ParteAsistenciaData | null>(null);
  const [tipoCitacion, setTipoCitacion] = useState<TipoCitacion[]>([]);
  const [date, setDate] =  useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const folio = window.location.pathname.split('/').pop();
        const [parteAsistenciaResponse, tipoCitacionResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/buscar/${folio}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })
        ]);

        if (!parteAsistenciaResponse.ok || !tipoCitacionResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const [parteAsistenciaData, tipoCitacionData] = await Promise.all([
          parteAsistenciaResponse.json(),
          tipoCitacionResponse.json()
        ]);

        setParteAsistencia(parteAsistenciaData);
        setTipoCitacion(tipoCitacionData);
        setDate(new Date(parteAsistenciaData.fechaAsistencia));
      } catch (err) {
        setError('Error fetching data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parteAsistencia || !date) return;

    setLoading(true);
    setError(null);
    try {
      const updatedData = {
        ...parteAsistencia,
        fechaAsistencia: formatearFecha(date.toDateString()),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/actualizar/${parteAsistencia.folioPAsistencia}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el parte de asistencia");
      }

      toast({
        title: "Parte de asistencia actualizado",
        description: "El parte de asistencia se ha actualizado exitosamente.",
      });
      router.push("/parte-asistencia");
    } catch (error) {
      setError("Hubo un error al actualizar el parte de asistencia.");
      toast({
        title: "Error",
        description: "Hubo un error al conectar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    name?: string
  ) => {
    if (!parteAsistencia) return;

    if (typeof e === "string" && name) {
      setParteAsistencia({ ...parteAsistencia, [name]: e });
    } else if (typeof e === "object") {
      const { name, value } = e.target;
      setParteAsistencia({ ...parteAsistencia, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">Cargando datos del parte de asistencia...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!parteAsistencia) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">No se encontraron datos del parte de asistencia.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Parte de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idTipoLlamado">Tipo de llamado</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "idTipoLlamado")
                  }
                  value={parteAsistencia.idTipoLlamado.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el tipo de llamado" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoCitacion.map((tipo) => (
                      <SelectItem
                        key={tipo.idTipoLlamado}
                        value={tipo.idTipoLlamado.toString()}
                      >
                        {tipo.nombreTipoLlamado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="direccionAsistencia">Dirección</Label>
                <Input
                  id="direccionAsistencia"
                  name="direccionAsistencia"
                  value={parteAsistencia.direccionAsistencia}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="horaInicio">Hora de Inicio</Label>
                <Input
                  id="horaInicio"
                  name="horaInicio"
                  type="time"
                  value={parteAsistencia.horaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="horaFin">Hora de Fin</Label>
                <Input
                  id="horaFin"
                  name="horaFin"
                  type="time"
                  value={parteAsistencia.horaFin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaAsistencia">Fecha de Asistencia</Label>
                <DatePicker
                  date={date}
                  setDate={(newDate) => setDate(newDate || new Date())}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  value={parteAsistencia.observaciones}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="aCargoDelCuerpo">
                  Oficial a cargo del cuerpo
                </Label>
                <Input
                  id="aCargoDelCuerpo"
                  name="aCargoDelCuerpo"
                  value={parteAsistencia.aCargoDelCuerpo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="aCargoDeLaCompania">
                  Oficial a cargo de la compañía
                </Label>
                <Input
                  id="aCargoDeLaCompania"
                  name="aCargoDeLaCompania"
                  value={parteAsistencia.aCargoDeLaCompania}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="totalAsistencia">Total de asistencia</Label>
                <Input
                  id="totalAsistencia"
                  name="totalAsistencia"
                  type="number"
                  value={parteAsistencia.totalAsistencia}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Actualizar Parte de Asistencia</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

