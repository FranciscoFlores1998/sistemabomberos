"use client";

import { useEffect, useState } from "react";
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
import { ChevronDown } from "lucide-react";
import { AgregarMovilesVoluntarios } from "./AgregarMovilesVoluntarios";

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  claveRadial: string;
}

interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}

interface FormData {
  folioPAsistencia: number|null;
  aCargoDelCuerpo: string;
  aCargoDeLaCompania: string;
  fechaAsistencia: string;
  horaInicio: string;
  horaFin: string;
  direccionAsistencia: string;
  totalAsistencia: string;
  observaciones: string;
  idTipoLlamado: string;
}

export default function FormParteAsistencia({
  params,
}: {
  params?: { folio: string };
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [citaciones, setCitaciones] = useState<TipoCitacion[]>([]);

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);

  const [formData, setFormData] = useState<FormData>({
    folioPAsistencia: null,
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
  const [errors, setErrors] = useState({
    aCargoDelCuerpo: false,
    aCargoDeLaCompania: false,
    horaInicio: false,
    horaFin: false,
    direccionAsistencia: false,
    totalAsistencia: false,
    idTipoLlamado: false,
  });
  const [mostrarSegundaParte, setMostrarSegundaParte] = useState(false);
  const [mostrarBoton, setMostrarBoton] = useState(true);
  const [loading, setLoading] = useState(true);

  const toggleSegundaParte = () => {
    setMostrarSegundaParte(true);
    setMostrarBoton(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    name?: string
  ) => {
    if (typeof e === "string" && name) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: e === "",
      }));
    } else if (typeof e !== "string") {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value === "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "aCargoDelCuerpo",
      "aCargoDeLaCompania",
      "horaInicio",
      "horaFin",
      "direccionAsistencia",
      "totalAsistencia",
      "idTipoLlamado",
    ];
    const newErrors = { ...errors };
    let hasError = false;

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field as keyof typeof errors] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      toast.error("Por favor, complete los campos obligatorios.");
      return;
    }

    const updatedFormData = {
      ...formData,
      fechaAsistencia: formatearFecha(date.toISOString()),
    };
    console.log(updatedFormData);

    try {
      const response = await fetch("/api/parte-asistencia/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        toast.success(
          params?.folio
            ? "Parte de asistencia actualizado exitosamente"
            : "Parte de asistencia registrado exitosamente"
        );
        const data = await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Hubo un error al ${
              params?.folio ? "actualizar" : "registrar"
            } el parte de asistencia.`
        );
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(
        `Hubo un error al ${
          params?.folio ? "actualizar" : "registrar"
        } el parte de asistencia.`
      );
    }
    setMostrarSegundaParte(true);
    setMostrarBoton(false);
  };

  ////////////////////////////////////////////////////////////////////////7
  return (
    <div className="container mx-auto py-10">
      <Card>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Crear Parte de asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                {/* Tipo ok*/}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="idTipoLlamado">Tipo de asistencia</Label>
                  <Select
                    onValueChange={(value) =>
                      handleChange(value, "idTipoLlamado")
                    }
                    value={formData.idTipoLlamado}
                  >
                    <SelectTrigger id="idTipoLlamado" className="w-full">
                      <SelectValue placeholder="Seleccione el tipo de asistencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {citaciones.map((option) => (
                        <SelectItem
                          key={option.idTipoLlamado}
                          value={option.idTipoLlamado.toString()}
                        >
                          {option.idTipoLlamado} - {option.nombreTipoLlamado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Hora de Inicio */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="horaInicio">Hora de Inicio</Label>
                  <Input
                    id="horaInicio"
                    name="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    required
                    className="border-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Hora de Fin */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="horaFin">Hora de Fin</Label>
                  <Input
                    id="horaFin"
                    name="horaFin"
                    type="time"
                    value={formData.horaFin}
                    onChange={handleChange}
                    required
                    className="border-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Fecha */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="fechaAsistencia">Fecha</Label>
                  <DatePicker
                    date={date}
                    setDate={(date) => setDate(date || new Date())}
                  />
                </div>
                {/* Dirección */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="direccionAsistencia">Dirección</Label>
                  <Input
                    id="direccionAsistencia"
                    name="direccionAsistencia"
                    value={formData.direccionAsistencia}
                    onChange={handleChange}
                    required
                    className="border-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* A cargo del cuerpo */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="aCargoDelCuerpo">Oficial</Label>
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
                      {voluntarios.map((option) => (
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
                {/*Oficial de compania*/}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="aCargoDeLaCompania">Oficial</Label>
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
                      {voluntarios.map((option) => (
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
                {/* observaciones */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="observaciones">observaciones</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    required
                    className="border-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {mostrarBoton && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={toggleSegundaParte}
                      className="flex items-center"
                    >
                      Mostrar más campos
                      <ChevronDown className="ml-2" />
                    </Button>
                  </div>
                )}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    mostrarSegundaParte
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                <>
                {formData.folioPAsistencia && (
                  <AgregarMovilesVoluntarios
                    folioPAsistencia={formData.folioPAsistencia}
                  />)}
                </>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Guardar Parte de asistencia
            </Button>
          </CardFooter>
        </Card>
      </Card>
      <Toaster />
      <style jsx>{`
        .border-red-500 {
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}
