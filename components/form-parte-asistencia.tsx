"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const [oficialDeCompania, setOficialDeCompania] = useState<Voluntario[]>([]);
  const [citaciones, setCitaciones] = useState<TipoCitacion[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  const [moviles, setMoviles] = useState<Movil[]>([]);

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
  const handleAddVoluntario = (voluntarioId: string) => {
    const voluntario = oficialDeCompania.find(
      (voluntario) => voluntario.idVoluntario === Number(voluntarioId)
    );
    if (voluntario) {
      setAddedVoluntarios((prev) => [...prev, voluntario]);

      setVoluntariosDisponibles((prev) =>
        prev.filter(
          (voluntario) => voluntario.idVoluntario !== Number(voluntarioId)
        )
      );
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
  const handleAddMovil = (movilId: string) => {
    console.log("movilId", movilId);
    //tiene que agregar al addedMoviles el movil seleccionado y elimiarlo de movilesDisponibles
    const movil = moviles.find((movil) => movil.idMovil === Number(movilId));
    console.log("movil", movil);
    if (movil) {
      setAddedMoviles((prev) => [...prev, movil]);
      //eliminar el movil de moviles
      setMoviles((prev) =>
        prev.filter((movil) => movil.idMovil !== Number(movilId))
      );
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setValue("fechaAsistencia", formatearFecha(new Date().toISOString()));
    const voluntariosData = await getVoluntarios();
    const citacionesData = await getTipoAsistencia();
    const movilesData = await getMoviles();
    setOficialDeCompania(voluntariosData);
    setVoluntariosDisponibles(voluntariosData);
    setCitaciones(citacionesData);
    setMoviles(movilesData);

    setLoading(false);
  };

  const fetchDataIdFolio = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/buscar/${params?.folio}`,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setValue("tipoCitacion", data.idTipoLlamado.toString());
      setValue("horaInicio", data.horaInicio);
      setValue("horaFin", data.horaFin);
      setValue("direccionAsistencia", data.direccionAsistencia);
      setValue("oficialCargo", data.aCargoDelCuerpo.toString());
      setValue("oficialCompania", data.aCargoDeLaCompania.toString());
      setValue("observaciones", data.observaciones);
      setValue("totalAsistencia", data.totalAsistencia.toString());
      setDate(new Date(data.fechaAsistencia));
      setValue("fechaAsistencia", formatearFecha(data.fechaAsistencia));

      const voluntariosData = await getVoluntarios();
      const citacionesData = await getTipoAsistencia();
      const movilesData = await getMoviles();
      setOficialDeCompania(voluntariosData);

      setCitaciones(citacionesData);
      //eliminar los moviles agregados de todos los moviles disponibles
      console.log("data.moviles", data.moviles);
      if (data.moviles.length > 0 && data) {
        const filtredMoviles = movilesData.filter((movil) => {
          return !data.moviles.some((movilAdded) => movilAdded.idMovil === movil.idMovil);

        })
        console.log("filtredMoviles", filtredMoviles);
        setMoviles(filtredMoviles);
        setAddedMoviles(data.moviles);
      }
      //eliminar los voluntarios agregados de todos los voluntarios disponibles
      if (data.voluntarios.length > 0 && data) {
        const filtredVoluntarios = voluntariosData.filter((voluntario) => {
          return !data.voluntarios.some((voluntarioAdded) => voluntarioAdded.idVoluntario === voluntario.idVoluntario);
        })
        setVoluntariosDisponibles(filtredVoluntarios);
        setAddedVoluntarios(data.voluntarios);
      }
      

      setLoading(false);
    }
  };

  useEffect(() => {
    params?.folio ? fetchDataIdFolio() : fetchData();
  }, [params?.folio]);

  const onSubmitAttendance = async (data: any) => {
    console.log("data", data);
    const dataSend = {
      parteAsistencia: {
        ...(params?.folio && { folioPAsistencia: Number(params.folio) }),
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
      moviles: addedMoviles.map((movil) => movil.idMovil),
      voluntarios: addedVoluntarios.map(
        (voluntario) => voluntario.idVoluntario
      ),
    };
    console.log("dataSend", dataSend);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/guardar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(dataSend),
        }
      );

      if (response.ok) {
        router.push("/parte-asistencia");
        toast.success(
          params?.folio
            ? "Parte de asistencia actualizado exitosamente"
            : "Parte de asistencia registrado exitosamente"
        );
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al guardar el parte de asistencia"
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
                  {oficialDeCompania.map((oficialCargo) => (
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
                  {oficialDeCompania.map((oficialCompania) => (
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
                      handleAddMovil(value);
                    }}
                    value={watch("movil")}
                
                  >
                    <SelectTrigger
                      className={`w-full `}
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
                  <ul className="list-none">
                    {addedMoviles.map((movil) => (
                      <li
                        key={movil.idMovil}
                        className="flex items-center gap-4 py-1"
                      >
                        <div>
                          {movil.nomenclatura} - {movil.especialidad}
                        </div>
                        <div>
                          <Button
                            onClick={() => {
                              setMoviles((prev) => [...prev, movil]);
                              setAddedMoviles((prev) =>
                                prev.filter(
                                  (movilAdded) =>
                                    movilAdded.idMovil !== movil.idMovil
                                )
                              );
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col space-y-4 mt-6">
                <h3 className="text-lg font-semibold">
                  Agregar Voluntarios al Parte de Asistencia
                </h3>
                <div className="flex space-x-2">
                  <Select
                    onValueChange={(value) => {
                      setValue("voluntario", value);
                      clearErrors("voluntario");
                      handleAddVoluntario(value);
                    }}
                    value={watch("voluntario")}
                   
                  >
                    <SelectTrigger
                      className={`w-full `}
                    >
                      <SelectValue placeholder="Voluntarios" />
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
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">
                    Voluntarios Agregados:
                  </h4>
                  <ul className="list-none">
                    {addedVoluntarios.map((voluntario) => (
                      <li
                        key={voluntario.idVoluntario}
                        className="flex items-center gap-4 py-1"
                      >
                        <div>
                          {voluntario.claveRadial} - {voluntario.nombreVol}
                        </div>
                        <div>
                          <Button
                            onClick={() => {
                              setVoluntariosDisponibles((prev) => [
                                ...prev,
                                voluntario,
                              ]);
                              setAddedVoluntarios((prev) =>
                                prev.filter(
                                  (voluntarioAdded) =>
                                    voluntarioAdded.idVoluntario !==
                                    voluntario.idVoluntario
                                )
                              );
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

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
