"use client";

import React, { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { formatearFecha } from "@/lib/formatearFecha";
import { format, validate } from "@/lib/formatearRut";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  claveRadial: string;
}

interface Movil {
  idMovil: number;
  nomenclatura: string;
  especialidad: string;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

interface MaterialPeligroso {
  idMaterialP: number;
  clasificacion: string;
}

interface ParteAsistencia {
  folioPAsistencia: number;
  observaciones: string;
}

export default function FormParteEmergencia({
  params,
}: {
  params?: { folio: string };
}) {
  const [loading, setLoading] = useState(true);
  const [oficialParteEmergencia, setOficialParteEmergencia] = useState<
    Voluntario[]
  >([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [voluntariosDisponibles, setVoluntariosDisponibles] = useState<
    Voluntario[]
  >([]);
  const [addedMoviles, setAddedMoviles] = useState<Movil[]>([]);
  const [addedVoluntarios, setAddedVoluntarios] = useState<Voluntario[]>([]);
  const [clavesEmergencia, setClavesEmergencia] = useState<ClaveEmergencia[]>(
    []
  );
  const [materialesPeligrosos, setMaterialesPeligrosos] = useState<
    MaterialPeligroso[]
  >([]);
  const [partesAsistencia, setPartesAsistencia] = useState<ParteAsistencia[]>(
    []
  );
  const [addedVictima, setAddedVictima] = useState([]);

  const handleChangeRut = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const formattedRut = format(value);
    const isValid = validate(formattedRut);

    if (isValid || getValues("victimRut") === "") {
      clearErrors("victimRut");
    } else {
      setError("victimRut", {});
    }

    setValue("victimRut", formattedRut);
  };

  const methods = useForm({ mode: "onChange" });
  const {
    register,
    setValue,
    watch,
    getValues,
    handleSubmit,
    clearErrors,
    setError,
    reset,
    control,
    formState: { errors, isDirty },
  } = methods;
  const router = useRouter();

  const getMaterialPeligroso = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/materialP/obtener`,
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
      return [];
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
    const voluntario = oficialParteEmergencia.find(
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
    //tiene que agregar al addedMoviles el movil seleccionado y elimiarlo de movilesDisponibles
    const movil = moviles.find((movil) => movil.idMovil === Number(movilId));

    if (movil) {
      setAddedMoviles((prev) => [...prev, movil]);
      //eliminar el movil de moviles
      setMoviles((prev) =>
        prev.filter((movil) => movil.idMovil !== Number(movilId))
      );
    }
  };

  const getPartesAsistencia = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`,
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
  const getClavesEmergencia = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`,
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
  const handleVictima = () => {
    if (errors.victimRut) {
      return;
    }
    //si ninguno de los campos de la victima presenta valores, retornar
    if (
      !getValues("victimRut") &&
      !getValues("victimName") &&
      !getValues("victimAge") &&
      !getValues("victimDescription")
    ) {
      return;
    }
    const dataVictima = {
      rutVictima: getValues("victimRut"),
      nombreVictima: getValues("victimName"),
      edadVictima: getValues("victimAge"),
      descripcion: getValues("victimDescription"),
    };

    setValue("victimRut", "");
    setValue("victimName", "");
    setValue("victimAge", "");
    setValue("victimDescription", "");
    setAddedVictima((prev) => [...prev, dataVictima]);
  };

  const fetchData = async () => {
    setLoading(true);
    setValue("fechaEmergencia", formatearFecha(new Date().toISOString()));
    const voluntariosData = await getVoluntarios();
    const movilesData = await getMoviles();
    const partesAsistenciaData = await getPartesAsistencia();
    const materialesPeligrososData = await getMaterialPeligroso();
    const clavesEmergenciaData = await getClavesEmergencia();
    setOficialParteEmergencia(voluntariosData);
    setVoluntariosDisponibles(voluntariosData);
    setMoviles(movilesData);
    setPartesAsistencia(partesAsistenciaData);
    setMaterialesPeligrosos(materialesPeligrososData);
    setLoading(false);
    setClavesEmergencia(clavesEmergenciaData);
  };
  const fetchDataIdFolio = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${params?.folio}`,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      setValue("horaInicio", data.horaInicio);
      setValue("horaFin", data.horaFin);
      setValue("fechaEmergencia", formatearFecha(data.fechaEmergencia));
      setValue("preInforme", data.preInforme);
      setValue("llamarEmpresaQuimica", data.llamarEmpresaQuimica);
      setValue("descripcionMaterialP", data.descripcionMaterialP);
      setValue("direccionEmergencia", data.direccionEmergencia);
      setValue("oficialCargo", data.idOficial.toString());

      setValue("idClaveEmergencia", data.idClaveEmergencia.toString());
      setValue("folioPAsistencia", data.folioPAsistencia.toString());
      setDate(new Date(data.fechaEmergencia));
      setValue(
        "idMaterialP",
        data.materialesP.length > 0
          ? data.materialesP[0].idMaterialP.toString()
          : ""
      );
      setAddedVictima(data.victimas);
      const voluntariosData = await getVoluntarios();
      const movilesData = await getMoviles();
      const partesAsistenciaData = await getPartesAsistencia();
      const materialesPeligrososData = await getMaterialPeligroso();
      const clavesEmergenciaData = await getClavesEmergencia();
      setOficialParteEmergencia(voluntariosData);
      setClavesEmergencia(await getClavesEmergencia());
      setPartesAsistencia(partesAsistenciaData);
      setMaterialesPeligrosos(materialesPeligrososData);

      //eliminar los moviles agregados de todos los moviles disponibles

      if (data.moviles.length > 0 && data) {
        const filtredMoviles = movilesData.filter((movil) => {
          return !data.moviles.some(
            (movilAdded) => movilAdded.idMovil === movil.idMovil
          );
        });

        setMoviles(filtredMoviles);
        setAddedMoviles(data.moviles);
      }
      //eliminar los voluntarios agregados de todos los voluntarios disponibles
      if (data.voluntarios.length > 0 && data) {
        const filtredVoluntarios = voluntariosData.filter((voluntario) => {
          return !data.voluntarios.some(
            (voluntarioAdded) =>
              voluntarioAdded.idVoluntario === voluntario.idVoluntario
          );
        });
        setVoluntariosDisponibles(filtredVoluntarios);
        setAddedVoluntarios(data.voluntarios);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    params?.folio ? fetchDataIdFolio() : fetchData();
  }, []);

  const onSubmitEmergency = async (data: any) => {
    console.log("data", data);
    const dataSend = {
      parteEmergencia: {
        ...(params?.folio ? { folioPEmergencia: params.folio } : {}),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        fechaEmergencia: data.fechaEmergencia,
        preInforme: data.preInforme,
        llamarEmpresaQuimica: data.llamarEmpresaQuimica ?? false,
        descripcionMaterialP: data.descripcionMaterialP,
        direccionEmergencia: data.direccionEmergencia,
        idOficial: Number(data.oficialCargo),
        idClaveEmergencia: Number(data.idClaveEmergencia),
        folioPAsistencia: data.folioPAsistencia
          ? Number(data.folioPAsistencia)
          : null,
      },
      moviles: addedMoviles.map((movil) => movil.idMovil),
      voluntarios: addedVoluntarios.map(
        (voluntario) => voluntario.idVoluntario
      ),
      materialesP: data.idMaterialP ? [Number(data.idMaterialP)] : [],
      victimas: addedVictima.length > 0 ? addedVictima : [],
    };
    console.log("dataSend", dataSend);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/guardar`,
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
        router.push("/parte-emergencia");
        toast.success(
          params?.folio
            ? "Parte de emergencia actualizado exitosamente"
            : "Parte de emergencia registrado exitosamente"
        );
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al guardar el parte de emergencia"
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
              ? "Editar Parte de Emergencia"
              : "Registro de Partes de Emergencia"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmitEmergency)}
            className="grid w-full items-center gap-4"
          >
            {/* Time and Date Inputs */}
            <div className="grid grid-cols-3 gap-y-3 mb-4">
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
              <div className="flex flex-col gap-y-2 space-y-1.5">
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
            </div>

            {/* Address Input */}
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="direccionEmergencia">Dirección</Label>
              <Input
                id="direccionEmergencia"
                {...register("direccionEmergencia", { required: true })}
                className={errors.direccionEmergencia ? "border-red-500" : ""}
              />
            </div>

            {/* Officer in Charge Select */}

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
                  {oficialParteEmergencia.map((oficialCargo) => (
                    <SelectItem
                      key={oficialCargo.idVoluntario}
                      value={oficialCargo.idVoluntario.toString()}
                    >
                      {oficialCargo.claveRadial} - {oficialCargo.nombreVol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observations Textarea */}
            <div className="flex flex-col gap-y-2 space-y-1.5">
              <Label htmlFor="preInforme">Observaciones</Label>
              <Textarea
                id="preInforme"
                {...register("preInforme", { required: true })}
                className={errors.preInforme ? "border-red-500" : ""}
              />
            </div>

            {/* Call Chemical Company Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="llamarEmpresaQuimica"
                checked={watch("llamarEmpresaQuimica")}
                onCheckedChange={(value) => {
                  setValue("llamarEmpresaQuimica", value);
                }}
              />
              <Label htmlFor="llamarEmpresaQuimica">
                Llamar a empresa química
              </Label>
            </div>

            {/* Hazardous Material Select */}
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label htmlFor="idMaterialP">Material Peligroso</Label>
              <Select
                onValueChange={(value) => {
                  setValue("idMaterialP", value);
                  clearErrors("idMaterialP");
                }}
                value={watch("idMaterialP")}
                {...register("idMaterialP", { required: true })}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.idMaterialP ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Seleccione Material Peligroso" />
                </SelectTrigger>
                <SelectContent>
                  {materialesPeligrosos.map((materialP) => (
                    <SelectItem
                      key={materialP.idMaterialP}
                      value={materialP.idMaterialP.toString()}
                    >
                      {materialP.clasificacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Hazardous Material Description */}

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="descripcionMaterialP">
                Descripción material peligroso
              </Label>
              <Textarea
                id="descripcionMaterialP"
                {...register("descripcionMaterialP", {
                  required: watch("idMaterialP")
                    ? "Este campo es requerido cuando se selecciona un material peligroso"
                    : false,
                })}
                disabled={!watch("idMaterialP")}
                className={errors.descripcionMaterialP ? "border-red-500" : ""}
              />
            </div>

            {/* Emergency Code Select */}
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label htmlFor="idClaveEmergencia">Clave Emergencia</Label>
              <Select
                onValueChange={(value) => {
                  setValue("idClaveEmergencia", value);
                  clearErrors("idClaveEmergencia");
                }}
                value={watch("idClaveEmergencia")}
                {...register("idClaveEmergencia", { required: true })}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.idClaveEmergencia ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Seleccione Clave Emergencia" />
                </SelectTrigger>
                <SelectContent>
                  {clavesEmergencia.map((claveEmergencia) => (
                    <SelectItem
                      key={claveEmergencia.idClaveEmergencia}
                      value={claveEmergencia.idClaveEmergencia.toString()}
                    >
                      {claveEmergencia.nombreClaveEmergencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assistance Report Folio Select */}
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
                      {partesAsistencia.map((option) => (
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
            <div className="flex flex-col space-y-4 mt-6">
              <h3 className="text-lg font-semibold">
                Agregar Móviles al Parte de Emergencia
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
                  <SelectTrigger className={`w-full `}>
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
                Agregar Voluntarios al Parte de Emergencia
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
                  <SelectTrigger className={`w-full `}>
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

            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Información de la Víctima</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="victimRut">RUT</Label>
                      <Input
                        id="victimRut"
                        {...register("victimRut", {
                          onChange: (e) => handleChangeRut(e),
                        })}
                        placeholder="Ingrese RUT"
                        className={`${
                          errors.victimRut
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.victimRut && (
                        <p className="text-red-500 text-sm">RUT inválido</p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="victimName">Nombre</Label>
                      <Input
                        id="victimName"
                        {...register("victimName")}
                        placeholder="Ingrese nombre"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="victimAge">Edad</Label>
                    <Input
                      id="victimAge"
                      type="number"
                      {...register("victimAge")}
                      placeholder="Ingrese edad"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="victimDescription">Descripción</Label>
                    <Textarea
                      id="victimDescription"
                      {...register("victimDescription")}
                      placeholder="Ingrese descripción"
                      rows={3}
                    />
                  </div>
                  <Button type="button" onClick={handleVictima}>
                    Guardar Información de la Víctima
                  </Button>
                  {/* crear una tabla con las victimas agregadas */}
                  {addedVictima.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            Rut Victima
                          </TableHead>
                          <TableHead>Nombre Victima</TableHead>
                          <TableHead>Edad Victima</TableHead>
                          <TableHead className="text-right">
                            Descripcion
                          </TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {addedVictima.map((victima) => (
                          <TableRow>
                            <TableCell className="font-medium">
                              {victima.rutVictima}
                            </TableCell>
                            <TableCell>{victima.nombreVictima}</TableCell>
                            <TableCell>{victima.edadVictima}</TableCell>
                            <TableCell className="text-right">
                              {victima.descripcionVictima}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setAddedVictima((prev) =>
                                    prev.filter(
                                      (victimaAdded) =>
                                        victimaAdded.rutVictima !==
                                        victima.rutVictima
                                    )
                                  );
                                }}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="mt-4">
              {params?.folio
                ? "Actualizar Parte de Emergencia"
                : "Guardar Parte de Emergencia"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
