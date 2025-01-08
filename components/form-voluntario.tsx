"use client";

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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [cargoVol, setCargos] = useState<Cargo[]>([]);
  const [isRutValid, setIsRutValid] = useState(true);
  const [dateNac, setDateNac] = useState<Date>(new Date());
  const [dateIng, setDateIng] = useState<Date>(new Date());
  const router = useRouter();
  const [formData, setFormData] = useState({
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

    formData.fechaIngreso = formatearFecha(dateIng.toISOString());
    formData.fechaNac = formatearFecha(dateNac.toISOString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/guardar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Voluntario registrado exitosamente.");
        router.push("/busqueda");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Hubo un error al registrar el voluntario.");
      }
    } catch (error) {
      toast.error("Hubo un error al registrar el voluntario.");
    }
  };

  useEffect(() => {
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
        setCompanias(data);
      } else {
        const errorData = await response.json();
        toast.error("Hubo un error al cargar las compañías.");
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
        setCargos(data);
      } else {
        const errorData = await response.json();
        toast.error("Hubo un error al cargar los cargos.");
      }
    };

    obtenerCargos();
    obtenerCompanias();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registro de Voluntario</CardTitle>
        </CardHeader>
        <CardContent>
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
                          !isRutValid || errors.rutVoluntario ? "border-red-500 focus:ring-red-500" : ""
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
                      <Label htmlFor="numeroContacto">Número de Contacto</Label>
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
                  <SelectTrigger className={`w-full ${errors.idCompania ? "border-red-500" : ""}`}>
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
                  <SelectTrigger className={`w-full ${errors.idCargo ? "border-red-500" : ""}`}>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={Object.values(errors).some(error => error) || !isRutValid}
          >
            Registrar Voluntario
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

