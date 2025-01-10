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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { set } from "date-fns";
import FallbackSpinner from "./ui/spinner";

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
  folioPAsistencia: number | null;
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
  const [loading, setLoading] = useState(true);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [citaciones, setCitaciones] = useState<TipoCitacion[]>([]);
  const [mostrarSegundaParte, setMostrarSegundaParte] = useState(false);
  const [mostrarBoton, setMostrarBoton] = useState(true);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [idParteAsistencia, setIdParteAsistencia] = useState<string | null>(
    params?.folio ?? null
  );
  const toggleSegundaParte = () => {
    setMostrarSegundaParte(true);
    setMostrarBoton(false);
  };

  const onSubmit = async (data: any) => {
    data.fechaAsistencia = formatearFecha(date.toISOString());
    console.log(data);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/guardar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(
          params?.folio
            ? "Parte de asistencia actualizo exitosamente"
            : "Parte de asistencia registrado exitosamente"
        );
        setIdParteAsistencia(data.folioPAsistencia);
        setMostrarSegundaParte(true);
        setMostrarBoton(false);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error ||
            `Hubo un error al ${params?.folio ? "actualizar" : "registrar"}
           el parte de asistencia.`
        );
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(
        `Hubo un error al ${params?.folio ? "actualizar" : "registrar"}
           el parte de asistencia.`
      );
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const voluntario = await obtenerVomuntarios();
    setVoluntarios(voluntario);
    const citacion = await obtenerCitaciones();
    setCitaciones(citacion);

    if (params?.folio) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/buscar/${params.folio}`,
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
          const val = {
            ...data,
            idTipoLlamado: null,
            idVoluntario: null,
          };
          reset(val);
          setDate(new Date(data.fechaAsistencia));
          setValue("idTipoLlamado", data.idTipoLlamado.toString());
          setValue("idVoluntario", data.idVoluntario);
          setLoading(false);
        } else {
          toast.error("Hubo un error al obtener los datos.");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Hubo un error al conectar con el servidor.");
      }
    } else {
      setLoading(false);
    }
  };
  const obtenerVomuntarios = async () => {
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
      return data;
    } else {
      toast.error("Hubo un error al obtener los datos.");
    }
  };
  const obtenerCitaciones = async () => {
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
      return data;
    } else {
      toast.error("Hubo un error al obtener los datos.");
    }
  };
  useEffect(() => {
    fetchData();
  }, [params?.folio]);

  ////////////////////////////////////////////////////////////////////////7
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {params?.folio
              ? "Editar Parte de Asistencia"
              : "Registro de Partes de Asistencias"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <FallbackSpinner />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                {/* Tipo ok*/}
                <div className="flex flex-col gap-y-2 space-y-1.5">
                  <Label htmlFor="idTipoLlamado">Tipo de asistencia</Label>
                  <Select
                    onValueChange={(value) => setValue("idTipoLlamado", value)}
                    value={watch("idTipoLlamado")}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors.idTipoLlamado ? "border-red-500" : ""
                      }`}
                    >
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
                <div className="grid grid-cols-3  gap-y-3 mb-4">
                  {/* Hora de Inicio */}
                  <div className="flex flex-col gap-y-2 space-y-1.5">
                    <Label htmlFor="horaInicio">Hora de Inicio</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      {...register("horaInicio", { required: true })}
                      className={errors.horaInicio ? "border-red-500" : ""}
                    />
                  </div>
                  {/* Hora de Fin */}
                  <div className="flex flex-col gap-y-2 space-y-1.5">
                    <Label htmlFor="horaFin">Hora de Fin</Label>
                    <Input
                      id="horaFin"
                      type="time"
                      {...register("horaFin", { required: true })}
                      className={errors.horaFin ? "border-red-500" : ""}
                    />
                  </div>
                  {/*Fecha */}
                  <div className="flex flex-col gap-y-2  space-y-1.5">
                    <Label htmlFor="fechaAsistencia">Fecha</Label>
                    <DatePicker
                      date={date}
                      setDate={(date) => setDate(date || new Date())}
                    />
                  </div>
                </div>
                {/* Dirección */}
                <div className="flex flex-col gap-y-2 space-y-1.5">
                  <Label htmlFor="direccionAsistencia">Dirección</Label>
                  <Input
                    id="direccionAsistencia"
                    value={watch("direccionAsistencia")}
                    {...register("direccionAsistencia", { required: true })}
                    className={
                      errors.direccionAsistencia ? "border-red-500" : ""
                    }
                  />
                </div>
                {/* A cargo del cuerpo */}
                <div className="flex flex-col gap-y-2 space-y-1.5">
                  <Label htmlFor="aCargoDelCuerpo">
                    Oficial a cargo del Cuerpo
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("aCargoDelCuerpo", value)
                    }
                    value={watch("aCargoDelCuerpo")}
                  >
                    <SelectTrigger className="w-full">
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
                <div className="flex flex-col gap-y-2 space-y-1.5">
                  <Label htmlFor="aCargoDeLaCompania">
                    Oficial de la Compañia
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("aCargoDeLaCompania", value)
                    }
                    value={watch("aCargoDeLaCompania")}
                  >
                    <SelectTrigger className="w-full">
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
                <div className="flex flex-col gap-y-2 space-y-1.5">
                  <Label htmlFor="observaciones">observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={watch("observaciones")}
                    {...register("observaciones", { required: true })}
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
                    {idParteAsistencia && (
                      <AgregarMovilesVoluntarios
                        folioPAsistencia={parseInt(idParteAsistencia)}
                      />
                    )}
                  </>
                </div>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={Object.values(errors).some((error) => error)}
          >
            {params?.folio
              ? "Actualizar Parte de Asistencia"
              : "Registrar Parte de Asistencia"}
          </Button>
        </CardFooter>
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
