"use client";

import React, { useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { formatearFecha } from "@/lib/formatearFecha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
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

interface Movil {
  idMovil: number;
  nomenclatura: string;
  especialidad: string;
}

export default function FormParteAsistencia({
  params,
}: {
  params?: { folio: string };
}) {
  const [loading, setLoading] = useState(true);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [citaciones, setCitaciones] = useState<TipoCitacion[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showSecondPart, setShowSecondPart] = useState(false);
  const [idParteAsistencia, setIdParteAsistencia] = useState<number | null>(
    null
  );
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [movilesDisponibles, setMovilesDisponibles] = useState<Movil[]>([]);
  const [voluntariosDisponibles, setVoluntariosDisponibles] = useState<
    Voluntario[]
  >([]);
  const [addedMoviles, setAddedMoviles] = useState<Movil[]>([]);
  const [addedVoluntarios, setAddedVoluntarios] = useState<Voluntario[]>([]);

  const methods = useForm({ mode: "onChange" });

  const {
    register,
    setValue,
    watch,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const getTipoAsistencia = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`,
        {
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
        throw new Error("Error al obtener datos");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };
  const getVoluntarios = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`,
        {
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
        throw new Error("Error al obtener datos");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };
  const getMoviles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movil/obtener`,
        {
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
        throw new Error("Error al obtener datos");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setValue("fechaAsistencia", formatearFecha(new Date().toISOString()));
    const voluntariosData = await getVoluntarios();
    const citacionesData = await getTipoAsistencia();
    const movilesData = await getMoviles();
    setVoluntarios(voluntariosData);
    setVoluntariosDisponibles(voluntariosData);
    setCitaciones(citacionesData);
    setMoviles(movilesData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params?.folio]);

  const onSubmitAttendance = async (data: any) => {
    console.log("data", data);
    const dataSend = {
      // {
      //   "parteAsistencia": {
      //     "aCargoDelCuerpo": 82,
      //     "aCargoDeLaCompania": 82,
      //     "fechaAsistencia": "2025-01-11",
      //     "horaInicio": "08:00:00",
      //     "horaFin": "12:00:00",
      //     "direccionAsistencia": "123 Main Street, Chillán",
      //     "totalAsistencia": 30,
      //     "observaciones": "Se agregaron más asistentes.",
      //     "idTipoLlamado": 2
      //   },
      //   "moviles": [1, 2, 3],
      //   "voluntarios": [81, 82, 83]
      // }
      parteAsistencia: {
        aCargoDelCuerpo: Number(data.oficialCargo),
        aCargoDeLaCompania: Number(data.oficialCompania),
        fechaAsistencia: data.fechaAsistencia,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        direccionAsistencia: data.direccionAsistencia,
        totalAsistencia: Number(data.totalAsistencia),
        observaciones: data.observaciones,
        idTipoLlamado: Number(data.tipoCitacion),
      },
    };
    console.log("dataSend", dataSend);
    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/guardar`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "ngrok-skip-browser-warning": "true",
    //       },
    //       body: JSON.stringify(dataSend),
    //     }
    //   );

    //   if (response.ok) {
    //     toast.success(
    //       params?.folio
    //         ? "Parte de asistencia actualizado exitosamente"
    //         : "Parte de asistencia registrado exitosamente"
    //     );
    //   } else {
    //     const errorData = await response.json();
    //     throw new Error(
    //       errorData.error || "Error al guardar el parte de asistencia"
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error al guardar:", error);
    //   toast.error(
    //     `Hubo un error al ${
    //       params?.folio ? "actualizar" : "registrar"
    //     } el parte de asistencia.`
    //   );
    // }
  };

  if (loading) {
    return <FallbackSpinner />;
  }

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
          <form
            onSubmit={handleSubmit(onSubmitAttendance)}
            className="grid w-full items-center gap-4"
          >
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label htmlFor="tipoCitacion">Tipo de Citacion</Label>
              <Select
                onValueChange={(value) => {
                  setValue("tipoCitacion", value);
                  clearErrors("tipoCitacion");
                }}
                value={watch("tipoCitacion")}
                {...register("tipoCitacion", { required: true })}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.tipoCitacion ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Seleccione tipo de Citacion" />
                </SelectTrigger>
                <SelectContent>
                  {citaciones.map((citacion) => (
                    <SelectItem
                      key={citacion.idTipoLlamado}
                      value={citacion.idTipoLlamado.toString()}
                    >
                      {citacion.nombreTipoLlamado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3  gap-y-3 mb-4">
              <div className="flex flex-col gap-y-2 space-y-1.5">
                <Label htmlFor="horaInicio">Hora de Inicio</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  {...register("horaInicio", { required: true })}
                  className={errors.horaInicio ? "border-red-500" : ""}
                />
              </div>
              <div className="flex flex-col gap-y-2 space-y-1.5">
                <Label htmlFor="horaFin">Hora de Fin</Label>
                <Input
                  id="horaFin"
                  type="time"
                  {...register("horaFin", { required: true })}
                  className={errors.horaFin ? "border-red-500" : ""}
                />
              </div>
              <div className="flex flex-col gap-y-2  space-y-1.5">
                <Label htmlFor="fechaAsistencia">Fecha</Label>
                <DatePicker
                  date={date}
                  setDate={(date) => {
                    setDate(date || new Date());
                    setValue(
                      "fechaAsistencia",
                      formatearFecha(
                        date?.toISOString() || new Date().toISOString()
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="direccionAsistencia">Dirección</Label>
              <Input
                id="direccionAsistencia"
                {...register("direccionAsistencia", { required: true })}
                className={errors.direccionAsistencia ? "border-red-500" : ""}
              />
            </div>
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label htmlFor="oficialCargo">Oficial a cargo del cuerpo</Label>
              <Select
                onValueChange={(value) => {
                  setValue("oficialCargo", value);
                  clearErrors("oficialCargo");
                }}
                value={watch("oficialCargo")}
                {...register("oficialCargo", { required: true })}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.oficialCargo ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Oficial a cargo" />
                </SelectTrigger>
                <SelectContent>
                  {voluntarios.map((oficialCargo) => (
                    <SelectItem
                      key={oficialCargo.idVoluntario}
                      value={oficialCargo.idVoluntario.toString()}
                    >
                      {oficialCargo.nombreVol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label htmlFor="oficialCompania">Oficial Compañia</Label>
              <Select
                onValueChange={(value) => {
                  setValue("oficialCompania", value);
                  clearErrors("oficialCompania");
                }}
                value={watch("oficialCompania")}
                {...register("oficialCompania", { required: true })}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.oficialCompania ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Oficial Compania" />
                </SelectTrigger>
                <SelectContent>
                  {voluntarios.map((oficialCompania) => (
                    <SelectItem
                      key={oficialCompania.idVoluntario}
                      value={oficialCompania.idVoluntario.toString()}
                    >
                      {oficialCompania.nombreVol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea id="observaciones" {...register("observaciones")} />
            </div>
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="totalAsistencia">Total Asistencia</Label>
              <Input
                id="totalAsistencia"
                {...register("totalAsistencia", { required: true })}
                className={errors.totalAsistencia ? "border-red-500" : ""}
              />
            </div>

            <div className="mt-8">
              <div className="flex flex-col space-y-4 mt-6">
                <h3 className="text-lg font-semibold">
                  Agregar Móviles al Parte de Asistencia
                </h3>
                <div className="flex space-x-2">
                  <Select
                    onValueChange={(value) => {
                      setValue("movil", value);
                      clearErrors("movil");
                    }}
                    value={watch("movil")}
                    {...register("movil", { required: true })}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors.movil ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Moviles" />
                    </SelectTrigger>
                    <SelectContent>
                      {moviles.map((movil) => (
                        <SelectItem
                          key={movil.idMovil}
                          value={movil.idMovil.toString()}
                        >
                          {movil.nomenclatura}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">
                    Móviles Agregados:
                  </h4>
                  <ul className="list-disc pl-5">
                    {addedMoviles.map((movil) => (
                      <li key={movil.idMovil}>
                        {movil.nomenclatura} - {movil.especialidad}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* <div className="flex flex-col space-y-4 mt-6">
              <h3 className="text-lg font-semibold">
                Agregar Voluntarios al Parte de Asistencia
              </h3>
              <div className="flex space-x-2">
                <Controller
                  name="voluntario"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un Voluntario" />
                      </SelectTrigger>
                      <SelectContent>
                        {voluntariosDisponibles.map((voluntario) => (
                          <SelectItem
                            key={voluntario.idVoluntario}
                            value={voluntario.idVoluntario.toString()}
                          >
                            {voluntario.claveRadial} - {voluntario.nombreVol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  onClick={() => {
                    const voluntarioValue = watch("voluntario");
                    if (voluntarioValue) handleAddVoluntario(voluntarioValue);
                  }}
                >
                  Agregar Voluntario
                </Button>
              </div>
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">
                  Voluntarios Agregados:
                </h4>
                <ul className="list-disc pl-5">
                  {addedVoluntarios.map((voluntario) => (
                    <li key={voluntario.idVoluntario}>
                      {voluntario.claveRadial} - {voluntario.nombreVol}
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}

              <Button type="submit" className="mt-4">
                Guardar Parte de Asistencia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
