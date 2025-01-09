"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import toast from "react-hot-toast";
import FallbackSpinner from "./ui/spinner";
import { Checkbox } from "./ui/checkbox";
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

interface FormData {
  nombreVol: string;
  fechaNac: string;
  fechaIngreso: string;
  direccion: string;
  numeroContacto: string;
  tipoSangre: string;
  enfermedades: string;
  alergias: string;
  claveRadial: string;
  idCargo: string;
  rutVoluntario: string;
  idCompania: string;
  idUsuario: number | null;
  apellidop: string;
  apellidom: string;
  activo: boolean;
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
  const [formData, setFormData] = useState<FormData>({
    nombreVol: "",
    fechaNac: "",
    fechaIngreso: "",
    direccion: "",
    numeroContacto: "",
    tipoSangre: "",
    enfermedades: "",
    alergias: "",
    claveRadial: "",
    idCargo: "",
    rutVoluntario: "",
    idCompania: "",
    idUsuario: null,
    apellidop: "",
    apellidom: "",
    activo: true,
  });

  const [errors, setErrors] = useState({
    apellidop: false,
    apellidom: false,
    nombreVol: false,
    rutVoluntario: false,
    direccion: false,
    claveRadial: false,
    idCompania: false,
    idCargo: false,
  });

  const handleChangeRut = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const formattedRut = format(value);
    const isValid = validate(formattedRut);
    setIsRutValid(isValid);
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedRut,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !isValid,
    }));
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
      "apellidop",
      "apellidom",
      "nombreVol",
      "rutVoluntario",
      "direccion",
      "claveRadial",
      "idCompania",
      "idCargo",
    ];
    const newErrors = { ...errors };
    let hasError = false;

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field as keyof typeof errors] = true;
        hasError = true;
      }
    });

    if (hasError || !isRutValid) {
      setErrors(newErrors);
      toast.error("Por favor, complete los campos obligatorios.");
      return;
    }

    const updatedFormData = {
      ...formData,
      fechaIngreso: formatearFecha(dateIng.toISOString()),
      fechaNac: formatearFecha(dateNac.toISOString()),
    };
    console.log(updatedFormData);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/guardar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(updatedFormData),
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
          setFormData(data);

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
  const handleChangeSwitch = (value: boolean, name: string) => {
    console.log(value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

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
            <form onSubmit={handleSubmit}>
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
                          name="apellidop"
                          value={formData.apellidop}
                          onChange={handleChange}
                          required
                          className={errors.apellidop ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="apellidom">Apellido Materno</Label>
                        <Input
                          id="apellidom"
                          name="apellidom"
                          value={formData.apellidom}
                          onChange={handleChange}
                          required
                          className={errors.apellidom ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="nombreVol">Nombres</Label>
                        <Input
                          id="nombreVol"
                          name="nombreVol"
                          value={formData.nombreVol}
                          onChange={handleChange}
                          required
                          className={errors.nombreVol ? "border-red-500" : ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="rutVoluntario">RUT Voluntario</Label>
                        <Input
                          id="rutVoluntario"
                          name="rutVoluntario"
                          value={formData.rutVoluntario}
                          onChange={handleChangeRut}
                          className={`${
                            !isRutValid || errors.rutVoluntario
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          required
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
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                          className={errors.direccion ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="numeroContacto">
                          Número de Contacto
                        </Label>
                        <Input
                          id="numeroContacto"
                          name="numeroContacto"
                          value={formData.numeroContacto}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="enfermedades">Enfermedades</Label>
                        <Textarea
                          id="enfermedades"
                          name="enfermedades"
                          value={formData.enfermedades}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="alergias">Alergias</Label>
                        <Textarea
                          id="alergias"
                          name="alergias"
                          value={formData.alergias}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 mt-4">
                      <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                      <Select
                        onValueChange={(value) =>
                          handleChange(value, "tipoSangre")
                        }
                        value={formData.tipoSangre}
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
                  <Switch checked = {formData.activo} id="activo" 

                  onCheckedChange={(value) => handleChangeSwitch(value, "activo")}
                  />
                  <Label htmlFor="activo">Voluntario activo</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="claveRadial">Clave Radial</Label>
                    <Input
                      id="claveRadial"
                      name="claveRadial"
                      value={formData.claveRadial}
                      onChange={handleChange}
                      required
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
                    onValueChange={(value) => handleChange(value, "idCompania")}
                    value={formData.idCompania}
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
                    onValueChange={(value) => handleChange(value, "idCargo")}
                    value={formData.idCargo}
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
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              Object.values(errors).some((error) => error) || !isRutValid
            }
          >
            {params?.id ? "Actualizar Voluntario" : "Registrar Voluntario"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
