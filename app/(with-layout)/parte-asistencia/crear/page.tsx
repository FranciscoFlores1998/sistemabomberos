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
import { DatePicker } from "@/components/ui/datepicker";
import { formatearFecha } from "@/lib/formatearFecha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";

interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}
interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
}
export default function CrearParteAsistencia() {
  const [tipoCitacion, setTipoCitacion] = useState<TipoCitacion[]>([]);
  const [oficial, setOficial] = useState<Voluntario[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | string
      | Date,
    name?: string
  ) => {
    if (e instanceof Date && name) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e,
      }));
    } else if (typeof e === "string" && name) {
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
    // Clear the error for this field when it's changed
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name as string]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = [
      "idTipoLlamado",
      "direccionAsistencia",
      "horaInicio",
      "horaFin",
      "observaciones",
      "aCargoDelCuerpo",
      "totalAsistencia",
    ];
    const errors: Record<string, boolean> = {};
    let hasError = false;

    requiredFields.forEach((field) => {
      const element = document.getElementById(field);
      if (!formData[field as keyof typeof formData]) {
        element?.classList.add("border-red-500");
        hasError = true;
      } else {
        element?.classList.remove("border-red-500");
      }
    });

    setFieldErrors(errors);

    if (hasError) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

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
        toast.success("El parte de asistencia se ha creado exitosamente.");
        router.push("/parte-asistencia");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "Hubo un error al crear el parte de asistencia."
        );
      }
    } catch (error) {
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const responseTipoLlamado = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (responseTipoLlamado.ok) {
          const dataTipoLlamado = await responseTipoLlamado.json();
          setTipoCitacion(dataTipoLlamado);
        } else {
          toast.error("Hubo un error al obtener el tipo de citación.");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Hubo un error al conectar con el servidor.");
      }
    };
    const obtenerVoluntarios = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`,
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
        setOficial(data);
      } else {
        const errorData = await response.json();
        console.error("Error al obtener los voluntarios:", errorData.error);
      }
    };
    obtenerVoluntarios();
    obtenerDatos();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Parte de Asistencia</CardTitle>
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
                  <SelectTrigger
                    className={`w-full ${
                      fieldErrors.idTipoLlamado ? "border-red-500" : ""
                    }`}
                  >
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
                  value={formData.direccionAsistencia}
                  onChange={handleChange}
                  required
                  className={
                    fieldErrors.direccionAsistencia ? "border-red-500" : ""
                  }
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
                  className={fieldErrors.horaInicio ? "border-red-500" : ""}
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
                  className={fieldErrors.horaFin ? "border-red-500" : ""}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaAsistencia">Fecha de Asistencia</Label>
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
                  className={fieldErrors.observaciones ? "border-red-500" : ""}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="aCargoDelCuerpo">
                  Oficial a cargo del cuerpo
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "aCargoDelCuerpo")
                  }
                  value={formData.aCargoDelCuerpo}
                >
                  <SelectTrigger id="aCargoDelCuerpo" className="w-full">
                    <SelectValue placeholder="Seleccione un Oficial" />
                  </SelectTrigger>
                  <SelectContent>
                    
                  <SelectItem value="null">Ninguno</SelectItem>
                    {oficial.map((option) => (
                      <SelectItem
                        key={option.idVoluntario}
                        value={option.idVoluntario.toString()}
                      >
                        {option.idVoluntario} - {option.nombreVol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="aCargoDeLaCompania">
                  Oficial a cargo de la compañia
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "aCargoDeLaCompania")
                  }
                  value={formData.aCargoDeLaCompania}
                >
                  <SelectTrigger id="aCargoDeLaCompania" className="w-full">
                    <SelectValue placeholder="Seleccione un Oficial" />
                  </SelectTrigger>
                  <SelectContent>
                    
                  <SelectItem value="null">Ninguno</SelectItem>
                    {oficial.map((option) => (
                      <SelectItem
                        key={option.idVoluntario}
                        value={option.idVoluntario.toString()}
                      >
                        {option.idVoluntario} - {option.nombreVol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="totalAsistencia">Total de asistencia</Label>
                <Input
                  id="totalAsistencia"
                  name="totalAsistencia"
                  value={formData.totalAsistencia}
                  onChange={handleChange}
                  required
                  className={
                    fieldErrors.totalAsistencia ? "border-red-500" : ""
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Crear Parte de Asistencia</Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
