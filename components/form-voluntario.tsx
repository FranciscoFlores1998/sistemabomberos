"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerPast } from "@/components/ui/datepicker-past";
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
import { format, validate } from "@/lib/formatearRut";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FallbackSpinner from "./ui/spinner";
import { Switch } from "./ui/switch";

// Datos de muestra para los selectores
const tiposSangre = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface Compania {
  idCompania: number;
  nombreCia: string;
  direccionCia: string;
  especialidad: string;
  idCuerpo: number;
}

interface Cargo {
  idCargo: number;
  nombreCarg: string;
}

export default function FormVoluntario({
  params,
}: {
  params?: { id: string };
}) {
  const [companiaVol, setCompanias] = useState<Compania[]>([]);
  const [loading, setLoading] = useState(true);
  const [cargoVol, setCargos] = useState<Cargo[]>([]);
  const [isRutValid, setIsRutValid] = useState(true);
  const [dateNac, setDateNac] = useState<Date>(new Date());
  const [dateIng, setDateIng] = useState<Date>(new Date());
  const router = useRouter();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleChangeRut = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const formattedRut = format(value);
    const isValid = validate(formattedRut);
    setIsRutValid(isValid);
    setValue("rutVoluntario", formattedRut);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    data.fechaNac = formatearFecha(dateNac.toISOString());
    data.fechaIngreso = formatearFecha(dateIng.toISOString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/guardar`,
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
        toast.success(
          params?.id
            ? "Voluntario actualizado exitosamente."
            : "Voluntario registrado exitosamente."
        );
        router.push("/voluntario");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error ||
            `Hubo un error al ${
              params?.id ? "actualizar" : "registrar"
            } el voluntario.`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Hubo un error al ${
          params?.id ? "actualizar" : "registrar"
        } el voluntario.`
      );
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const companias = await obtenerCompanias();
    const cargos = await obtenerCargos();

    setCompanias(companias);
    setCargos(cargos);
    if (params?.id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/voluntario/buscar/${params.id}`,
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
            idCompania: null,
            idCargo: null,
          };
          reset(val);
          setValue("idCompania", data.idCompania.toString());
          setValue("idCargo", data.idCargo.toString());
          setDateNac(new Date(data.fechaNac));
          setDateIng(new Date(data.fechaIngreso));
          setLoading(false);
        } else {
          toast.error("Hubo un error al cargar los datos del voluntario.");
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
        toast.error("Hubo un error al cargar los datos del voluntario.");
      }
    } else {
      setLoading(false);
    }
  };

  const obtenerCompanias = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/compania/obtener`,
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
      const errorData = await response.json();
      toast.error("Hubo un error al cargar las compañías.");
      return [];
    }
  };

  const obtenerCargos = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cargo/obtener`,
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
      const errorData = await response.json();
      toast.error("Hubo un error al cargar los cargos.");
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, [params?.id]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {params?.id ? "Editar Voluntario" : "Registro de Voluntario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <FallbackSpinner />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <Card className="w-full pt-3 ">
                  <CardContent>
                    <h6 className="text-lg font-semibold pb-3">
                      Datos Personales
                    </h6>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="apellidop">Apellido Paterno</Label>
                        <Input
                          id="apellidop"
                          value={watch("apellidop")}
                          {...register("apellidop", { required: true })}
                          className={errors.apellidop ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="apellidom">Apellido Materno</Label>
                        <Input
                          id="apellidom"
                          value={watch("apellidom")}
                          {...register("apellidom", { required: true })}
                          className={errors.apellidom ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="nombreVol">Nombres</Label>
                        <Input
                          id="nombreVol"
                          value={watch("nombreVol")}
                          {...register("nombreVol", { required: true })}
                          className={errors.nombreVol ? "border-red-500" : ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="rutVoluntario">RUT Voluntario</Label>
                        <Input
                          id="rutVoluntario"
                          value={watch("rutVoluntario")}
                          {...register("rutVoluntario", {
                            required: true,
                            onChange: (e) => handleChangeRut(e),
                          })}
                          className={`${
                            !isRutValid || errors.rutVoluntario
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                        />
                        {!isRutValid && (
                          <p className="text-red-500 text-sm">RUT inválido</p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                        <DatePickerPast
                          date={dateNac}
                          setDate={(date) => setDateNac(date || new Date())}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={watch("direccion")}
                          {...register("direccion", { required: true })}
                          className={errors.direccion ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="numeroContacto">
                          Número de Contacto
                        </Label>
                        <Input
                          id="numeroContacto"
                          value={watch("numeroContacto")}
                          {...register("numeroContacto")}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="enfermedades">Enfermedades</Label>
                        <Textarea
                          id="enfermedades"
                          value={watch("enfermedades")}
                          {...register("enfermedades")}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="alergias">Alergias</Label>
                        <Textarea
                          id="alergias"
                          value={watch("alergias")}
                          {...register("alergias")}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 mt-4">
                      <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                      <Select
                        onValueChange={(value) => setValue("tipoSangre", value)}
                        value={watch("tipoSangre")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione tipo de sangre" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposSangre.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                {/*Datos de Bomberos*/}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={watch("activo")}
                    id="activo"
                    onCheckedChange={(value) =>
                      setValue("activo", value || false)
                    }
                  />
                  <Label htmlFor="activo">Voluntario activo</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="claveRadial">Clave Radial</Label>
                    <Input
                      id="claveRadial"
                      value={watch("claveRadial")}
                      {...register("claveRadial", { required: true })}
                      className={errors.claveRadial ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                    <DatePickerPast
                      date={dateIng}
                      setDate={(date) => setDateIng(date || new Date())}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="idCompania">Compañía</Label>
                  <Select
                    onValueChange={(value) => setValue("idCompania", value)}
                    value={watch("idCompania")}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors.idCompania ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Seleccione compañía" />
                    </SelectTrigger>
                    <SelectContent>
                      {companiaVol.map((compania) => (
                        <SelectItem
                          key={compania.idCompania}
                          value={compania.idCompania.toString()}
                        >
                          {compania.nombreCia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="idCargo">Cargo Voluntario</Label>
                  <Select
                    onValueChange={(value) => setValue("idCargo", value)}
                    value={watch("idCargo")}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors.idCargo ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Seleccione cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargoVol.map((cargo) => (
                        <SelectItem
                          key={cargo.idCargo}
                          value={cargo.idCargo.toString()}
                        >
                          {cargo.nombreCarg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    Object.values(errors).some((error) => error) || !isRutValid
                  }
                >
                  {params?.id
                    ? "Actualizar Voluntario"
                    : "Registrar Voluntario"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
