"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatearFecha } from "@/lib/formatearFecha";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldValues,
  useFormContext
} from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import FallbackSpinner from "./ui/spinner";

interface ParteAsistencia {
  folioPAsistencia: number;
  observaciones: string;
}

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

interface MaterialPeligroso {
  idMaterialP: number;
  clasificacion: string;
}

interface FormParteEmergenciaProps {
  params?: { folio: string };
  onsubmitStep1: (data: any) => Promise<void>;
  setIdParteEmergencia: (id: number) => void;
}

export default function FormParteEmergencia({
  params,
}: FormParteEmergenciaProps) {
  const [loading, setLoading] = useState(true);
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState<
    ParteAsistencia[]
  >([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [claveemergencia, setClaveEmergencia] = useState<ClaveEmergencia[]>([]);
  const [materialesPeligrosos, setMaterialesPeligrosos] = useState<
    MaterialPeligroso[]
  >([]);
  const [date, setDate] = useState<Date>(new Date());

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const idMaterialP = watch("idMaterialP");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        parteAsistenciaRes,
        voluntariosRes,
        clavesEmergenciaRes,
        materialesPeligrososRes,
      ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`, {
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/materialP/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }),
      ]);

      if (
        parteAsistenciaRes.ok &&
        voluntariosRes.ok &&
        clavesEmergenciaRes.ok &&
        materialesPeligrososRes.ok
      ) {
        const [
          parteAsistenciaData,
          voluntariosData,
          clavesEmergenciaData,
          materialesPeligrososData,
        ] = await Promise.all([
          parteAsistenciaRes.json(),
          voluntariosRes.json(),
          clavesEmergenciaRes.json(),
          materialesPeligrososRes.json(),
        ]);

        setParteAsistenciaOptions(parteAsistenciaData);
        setVoluntarios(voluntariosData);
        setClaveEmergencia(clavesEmergenciaData);
        setMaterialesPeligrosos(materialesPeligrososData);
      } else {
        throw new Error("Failed to fetch data");
      }

      if (params?.folio) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${params.folio}`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setDate(new Date(data.fechaEmergencia));
        } else {
          throw new Error("Failed to fetch data");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("No se pudo cargar los datos necesarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params?.folio, setValue]);


  if (loading) {
    return <FallbackSpinner />;
  }

  function onsubmitStep1(arg0: FieldValues) {
    throw new Error("Function not implemented.");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onsubmitStep1(watch());
      }}
    >
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Crear Parte de Emergencia</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Hora Inicio */}
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="horaInicio">Hora de Inicio</Label>
              <Input
                id="horaInicio"
                type="time"
                {...register("horaInicio", { required: true })}
                className={errors.horaInicio ? "border-red-500" : ""}
              />
            </div>
            {/* Hora Fin */}
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="horaFin">Hora de Fin</Label>
              <Input
                id="horaFin"
                type="time"
                {...register("horaFin", { required: true })}
                className={errors.horaFin ? "border-red-500" : ""}
              />
            </div>
            {/* Fecha */}
            <div className="flex flex-col gap-y-2  space-y-1.5">
              <Label htmlFor="fechaEmergencia">Fecha</Label>
              <DatePicker
                date={date}
                setDate={(date) => {
                  setDate(date || new Date());
                  setValue(
                    "fechaEmergencia",
                    formatearFecha(
                      date?.toISOString() || new Date().toISOString()
                    )
                  );
                }}
              />
            </div>
            {/* Observaciones */}
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="preInforme">Observaciones</Label>
              <Textarea
                id="preInforme"
                {...register("preInforme", { required: true })}
                className={errors.preInforme ? "border-red-500" : ""}
              />
            </div>
            {/* Check Llamada:Terminar */}
            <div className="flex items-center space-x-2">
              <Controller
                name="llamarEmpresaQuimica"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="llamarEmpresaQuimica"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="llamarEmpresaQuimica">
                Llamar Empresa Química
              </Label>
            </div>
            {/* SELECT Llamada:Terminar */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="idMaterialP">Material Peligroso</Label>
              <Controller
                name="idMaterialP"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un Material Peligroso" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialesPeligrosos.map((material) => (
                        <SelectItem
                          key={material.idMaterialP}
                          value={material.idMaterialP.toString()}
                        >
                          {material.idMaterialP} - {material.clasificacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* Descripcion Material Peligroso */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="descripcionMaterialP">
                Descripción material peligroso
              </Label>
              <Textarea
                id="descripcionMaterialP"
                {...register("descripcionMaterialP", {
                  required: idMaterialP
                    ? "Este campo es requerido cuando se selecciona un material peligroso"
                    : false,
                })}
                disabled={!idMaterialP}
                className={errors.descripcionMaterialP ? "border-red-500" : ""}
              />
            </div>
            {/* Direccion Emergencia */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="direccionEmergencia">
                Dirección de Emergencia
              </Label>
              <Input
                id="direccionEmergencia"
                {...register("direccionEmergencia", {
                  required: "Este campo es requerido",
                })}
                className={errors.direccionEmergencia ? "border-red-500" : ""}
              />

            </div>
            {/* Oficial:Terminar */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="idOficial">Oficial</Label>
              <Controller
                name="idOficial"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="idOficial" className="w-full">
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
                )}
              />
            </div>
            {/* Clave de la emergencia:Terminar */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="idClaveEmergencia">Clave Emergencia</Label>
              <Controller
                name="idClaveEmergencia"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="idClaveEmergencia" className="w-full">
                      <SelectValue placeholder="Seleccione Clave Emergencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {claveemergencia.map((option) => (
                        <SelectItem
                          key={option.idClaveEmergencia}
                          value={option.idClaveEmergencia.toString()}
                        >
                          {option.idClaveEmergencia} -{" "}
                          {option.nombreClaveEmergencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              
            </div>
            {/*Folio de asistencia:Terminar */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="folioPAsistencia">Folio P. Asistencia</Label>
              <Controller
                name="folioPAsistencia"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un folio" />
                    </SelectTrigger>
                    <SelectContent>
                      {parteAsistenciaOptions.map((option) => (
                        <SelectItem
                          key={option.folioPAsistencia}
                          value={option.folioPAsistencia.toString()}
                        >
                          {option.folioPAsistencia} - {option.observaciones}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
