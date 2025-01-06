"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/datepicker";
import { formatearFecha } from "@/lib/formatearFecha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}

export default function CrearParteEmergencia() {
  const [date, setDate] = useState<Date>(new Date());
  const [tipoCitacion, setTipoCitacion] = useState<TipoCitacion[]>([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    folioPAsistencia: "",
    aCargoDelCuerpo: "",
    aCargoDeLaCompania: "",
    fechaAsistencia: "",
    horaInicio: "",
    horaFin: "",
    direccionAsistencia: "",
    totalAsistencia: "",
    observaciones: "",
    idTipoLlamado: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    name?: string
  ) => {
    if (typeof e === "string" && name) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e,
      }));
    } else {
      const { name, value } = (
        e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ).target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    formData.fechaAsistencia = formatearFecha(date.toISOString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Parte de asistencia creado",
          description: "El parte de asistencia se ha creado exitosamente.",
        });
        router.push("/parte-asistencia");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error || "Hubo un error al crear el parte de asistencia.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al conectar con el servidor.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const obtenerTipoLlamado = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTipoCitacion(data);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error || "Hubo un error al obtener el tipo de citación.",
          variant: "destructive",
        });
      }
    };
    obtenerTipoLlamado();
  }, []);
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Parte de Emergencia</CardTitle>
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
                  value={formData.idTipoLlamado}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un material peligroso" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoCitacion.map((llamado) => (
                      <SelectItem
                        key={llamado.idTipoLlamado}
                        value={llamado.idTipoLlamado.toString()}
                      >
                        {llamado.nombreTipoLlamado}
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
                  value={formData.direccionAsistencia}
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
                  value={formData.horaInicio}
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
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <DatePicker
                  date={date}
                  setDate={(date) => setDate(date || new Date())}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
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
                  value={formData.aCargoDelCuerpo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="aCargoDeLaCompania">
                  Oficial a cargo del compañía
                </Label>
                <Input
                  id="aCargoDeLaCompania"
                  name="aCargoDeLaCompania"
                  value={formData.aCargoDeLaCompania}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="totalAsistencia">Total de asistencia</Label>
                <Input
                  id="totalAsistencia"
                  name="totalAsistencia"
                  value={formData.totalAsistencia}
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
          <Button onClick={handleSubmit}>Crear Parte de Emergencia</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
