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

export default function EditarParteAsistencia() {
  const [tipoCitacion, setTipoCitacion] = useState<TipoCitacion[]>([]);
  const [oficial, setOficial] = useState<Voluntario[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const router = useRouter();
  const [formData, setFormData] = useState({
    folioPAsistencia: 0,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        errors[field] = true;
        hasError = true;
      } else {
        element?.classList.remove("border-red-500");
        errors[field] = false;
      }
    });

    setFieldErrors(errors);

    if (hasError) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

    const updatedFormData = {
      ...formData,
      fechaAsistencia: formatearFecha(date.toISOString()),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/actualizar/${formData.folioPAsistencia}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.ok) {
        toast.success("El parte de asistencia se ha actualizado exitosamente.");
        router.push("/parte-asistencia");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "Hubo un error al actualizar el parte de asistencia."
        );
      }
    } catch (error) {
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const folio = window.location.pathname.split('/').pop();
        const [parteAsistenciaResponse, tipoCitacionResponse, voluntariosResponse] = await Promise.all([
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
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })
        ]);

        if (!parteAsistenciaResponse.ok || !tipoCitacionResponse.ok || !voluntariosResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [parteAsistenciaData, tipoCitacionData, voluntariosData] = await Promise.all([
          parteAsistenciaResponse.json(),
          tipoCitacionResponse.json(),
          voluntariosResponse.json()
        ]);

        setFormData(parteAsistenciaData);
        setTipoCitacion(tipoCitacionData);
        setOficial(voluntariosData);
        setDate(new Date(parteAsistenciaData.fechaAsistencia));
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Hubo un error al obtener los datos. Por favor, intente de nuevo.");
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

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
                  value={formData.idTipoLlamado.toString()}
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
                  setDate={(newDate) => setDate(newDate || new Date())}
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
          <Button onClick={handleSubmit}>Actualizar Parte de Asistencia</Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}

