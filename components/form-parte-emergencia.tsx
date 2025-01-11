"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "react-hot-toast";
import FallbackSpinner from "./ui/spinner";
import { VictimaForm } from "./VictimaForm";
import { InstitucionForm } from "./InstitucionForm";
import { InmuebleForm } from "./InmuebleForm";
import { VehiculoForm } from "./VehiculoForm";

interface FormData {
  folioPEmergencia: number | null;
  horaInicio: string;
  horaFin: string;
  fechaEmergencia: string;
  preInforme: string;
  llamarEmpresaQuimica: boolean;
  descripcionMaterialP: string;
  direccionEmergencia: string;
  idOficial: string;
  idClaveEmergencia: string;
  folioPAsistencia: string | null;
  idMaterialP: string | null;
}

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
}

export default function FormParteEmergencia({ params }: FormParteEmergenciaProps) {
  const [loading, setLoading] = useState(true);
  const [parteEmergenciaCompleto, setParteEmergenciaCompleto] = useState(false);
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState<ParteAsistencia[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [claveemergencia, setClaveEmergencia] = useState<ClaveEmergencia[]>([]);
  const [materialesPeligrosos, setMaterialesPeligrosos] = useState<MaterialPeligroso[]>([]);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      folioPEmergencia: null,
      horaInicio: "",
      horaFin: "",
      fechaEmergencia: new Date().toISOString(),
      preInforme: "",
      llamarEmpresaQuimica: false,
      descripcionMaterialP: "",
      direccionEmergencia: "",
      idOficial: "",
      idClaveEmergencia: "",
      folioPAsistencia: null,
      idMaterialP: null,
    },
  });

  const idMaterialP = watch("idMaterialP");

  function isKeyOfFormData(key: string): key is keyof FormData {
    return key in FormData;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          parteEmergenciaRes,
          parteAsistenciaRes,
          voluntariosRes,
          clavesEmergenciaRes,
          materialesPeligrososRes,
        ] = await Promise.all([
          params?.folio
            ? fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${params.folio}`, {
                headers: {
                  "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true",
                },
              })
            : Promise.resolve({ ok: true, json: () => ({}) }),
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
          parteEmergenciaRes.ok &&
          parteAsistenciaRes.ok &&
          voluntariosRes.ok &&
          clavesEmergenciaRes.ok &&
          materialesPeligrososRes.ok
        ) {
          const [
            parteEmergenciaData,
            parteAsistenciaData,
            voluntariosData,
            clavesEmergenciaData,
            materialesPeligrososData,
          ] = await Promise.all([
            parteEmergenciaRes.json() as Promise<Partial<FormData>>,
            parteAsistenciaRes.json(),
            voluntariosRes.json(),
            clavesEmergenciaRes.json(),
            materialesPeligrososRes.json(),
          ]);

          if (params?.folio) {
            Object.keys(parteEmergenciaData).forEach((key) => {
              if (isKeyOfFormData(key)) {
                setValue(key, parteEmergenciaData[key] as any);
              }
            });
          }

          setParteAsistenciaOptions(parteAsistenciaData);
          setVoluntarios(voluntariosData);
          setClaveEmergencia(clavesEmergenciaData);
          setMaterialesPeligrosos(materialesPeligrososData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("No se pudo cargar los datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.folio, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch("/api/parte-emergencia/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          ...data,
          fechaEmergencia: formatearFecha(data.fechaEmergencia),
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Parte de emergencia guardado");
        setValue("folioPEmergencia", responseData.folioPEmergencia);
        setParteEmergenciaCompleto(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Hubo un error al crear el parte de emergencia.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el parte de emergencia.");
    }
  };

  if (loading) {
    return <FallbackSpinner />;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Parte de Emergencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="horaInicio">Hora de Inicio</Label>
              <Input
                id="horaInicio"
                type="time"
                {...register("horaInicio", { required: "Este campo es requerido" })}
                className={errors.horaInicio ? "border-red-500" : ""}
              />
              {errors.horaInicio && <span className="text-red-500">{errors.horaInicio.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="horaFin">Hora de Fin</Label>
              <Input
                id="horaFin"
                type="time"
                {...register("horaFin", { required: "Este campo es requerido" })}
                className={errors.horaFin ? "border-red-500" : ""}
              />
              {errors.horaFin && <span className="text-red-500">{errors.horaFin.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fechaEmergencia">Fecha</Label>
              <Controller
                name="fechaEmergencia"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date?.toISOString())}
                  />
                )}
              />
              {errors.fechaEmergencia && <span className="text-red-500">{errors.fechaEmergencia.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="preInforme">Pre-Informe</Label>
              <Textarea
                id="preInforme"
                {...register("preInforme", { required: "Este campo es requerido" })}
                className={errors.preInforme ? "border-red-500" : ""}
              />
              {errors.preInforme && <span className="text-red-500">{errors.preInforme.message}</span>}
            </div>
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
              <Label htmlFor="llamarEmpresaQuimica">Llamar Empresa Química</Label>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="idMaterialP">Material Peligroso</Label>
              <Controller
                name="idMaterialP"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un Material Peligroso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ninguno</SelectItem>
                      {materialesPeligrosos.map((material) => (
                        <SelectItem key={material.idMaterialP} value={material.idMaterialP.toString()}>
                          {material.idMaterialP} - {material.clasificacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="descripcionMaterialP">Descripción material peligroso</Label>
              <Textarea
                id="descripcionMaterialP"
                {...register("descripcionMaterialP", {
                  required: idMaterialP ? "Este campo es requerido cuando se selecciona un material peligroso" : false,
                })}
                disabled={!idMaterialP}
                className={errors.descripcionMaterialP ? "border-red-500" : ""}
              />
              {errors.descripcionMaterialP && (
                <span className="text-red-500">{errors.descripcionMaterialP.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="direccionEmergencia">Dirección de Emergencia</Label>
              <Input
                id="direccionEmergencia"
                {...register("direccionEmergencia", { required: "Este campo es requerido" })}
                className={errors.direccionEmergencia ? "border-red-500" : ""}
              />
              {errors.direccionEmergencia && (
                <span className="text-red-500">{errors.direccionEmergencia.message}</span>
              )}
            </div>
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
                        <SelectItem key={option.idVoluntario} value={option.idVoluntario.toString()}>
                          {option.idVoluntario} - {option.nombreVol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.idOficial && <span className="text-red-500">{errors.idOficial.message}</span>}
            </div>
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
                        <SelectItem key={option.idClaveEmergencia} value={option.idClaveEmergencia.toString()}>
                          {option.idClaveEmergencia} - {option.nombreClaveEmergencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.idClaveEmergencia && (
                <span className="text-red-500">{errors.idClaveEmergencia.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="folioPAsistencia">Folio P. Asistencia</Label>
              <Controller
                name="folioPAsistencia"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un folio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ninguno</SelectItem>
                      {parteAsistenciaOptions.map((option) => (
                        <SelectItem key={option.folioPAsistencia} value={option.folioPAsistencia.toString()}>
                          {option.folioPAsistencia} - {option.observaciones}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Guardar Parte de Emergencia
          </Button>
        </CardFooter>
      </Card>

      {parteEmergenciaCompleto && (
        <div className="mt-8">
          <Card className="w-full max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Agregar Víctima</CardTitle>
            </CardHeader>
            <CardContent>
              <VictimaForm folioPEmergencia={watch("folioPEmergencia")} />
            </CardContent>
          </Card>

          <Card className="w-full max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Agregar Institución</CardTitle>
            </CardHeader>
            <CardContent>
              <InstitucionForm folioPEmergencia={watch("folioPEmergencia")} />
            </CardContent>
          </Card>

          <Card className="w-full max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Agregar Inmueble</CardTitle>
            </CardHeader>
            <CardContent>
              <InmuebleForm folioPEmergencia={watch("folioPEmergencia")} />
            </CardContent>
          </Card>

          <Card className="w-full max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Agregar Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <VehiculoForm folioPEmergencia={watch("folioPEmergencia")} />
            </CardContent>
          </Card>
        </div>
      )}

      <Toaster />
      <style jsx>{`
        .border-red-500 {
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}

