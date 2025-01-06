"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/datepicker";
import { formatearFecha } from "@/lib/formatearFecha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerPast } from "@/components/ui/datepicker-past";
import { validateRut } from "@/lib/rutValidation";

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

export default function CrearVoluntario() {
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    name?: string
  ) => {
    if (typeof e === "string" && name) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e,
      }));
      if (name === "rutVoluntario") {
        setIsRutValid(validateRut(e));
      }
    } else {
      const { name, value } = (
        e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ).target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === "rutVoluntario") {
        setIsRutValid(validateRut(value));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    formData.fechaIngreso = formatearFecha(dateIng.toISOString());
    formData.fechaNac = formatearFecha(dateNac.toISOString());

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/crear`,
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
        toast({
          title: "Voluntario a sido registrado",
          description: "El voluntario se ha registrado exitosamente.",
        });
        router.push("/voluntario");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error || "Hubo un error al registrar el voluntario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al conectar con el servidor.",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description:
            errorData.error || "Hubo un error al cargar las compañías.",
          variant: "destructive",
        });
      }
    };
    const obtenerCargos = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cargo/obtener`,
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
        toast({
          title: "Error",
          description: errorData.error || "Hubo un error al cargar los cargos.",
          variant: "destructive",
        });
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
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nombreVol">Nombre</Label>
                <Input
                  id="nombreVol"
                  name="nombreVol"
                  value={formData.nombreVol}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rutVoluntario">RUT Voluntario</Label>
                <Input
                  id="rutVoluntario"
                  name="rutVoluntario"
                  value={formData.rutVoluntario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                <DatePickerPast
                date={dateNac}
                setDate={(date) => setDateNac(date || new Date())}/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
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
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <DatePickerPast
                date={dateIng}
                setDate={(date) => setDateIng(date || new Date())}/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idCompania">Compañía</Label>
                <Select
                  onValueChange={(value) => handleChange(value, "idCompania")}
                  value={formData.idCompania}
                >
                  <SelectTrigger className="w-full">
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
                  onValueChange={(value) =>
                    handleChange(value, "idCargo")
                  }
                  value={formData.idCargo}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargoVol.map((cargo) => (
                      <SelectItem 
                      key={cargo.idCargo} 
                      value={cargo.idCargo.toString()}> 
                        {cargo.nombreCarg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="claveRadial">Clave Radial</Label>
                <Input
                  id="claveRadial"
                  name="claveRadial"
                  value={formData.claveRadial}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                <Select
                  onValueChange={(value) => handleChange(value, "tipoSangre")}
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
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Registrar Voluntario</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
