
"use client";

import { useState } from "react";
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

// Datos de muestra para los selectores
const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const cargosVoluntario = ['Bombero', 'Conductor', 'Oficial', 'Comandante']
const companias = [
  { id: 1, nombre: 'Compañía 1' },
  { id: 2, nombre: 'Compañía 2' },
  { id: 3, nombre: 'Compañía 3' },
]

export default function CrearVoluntario() {
  const [fechaNac, setFechaNac] = useState<Date>(new Date());
  const [fechaIngreso, setFechaIngreso] = useState<Date>(new Date());
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
    cargoVoluntario: "",
    rutVoluntario: "",
    idCompania: "",
    idUsuario: "",
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
    } else {
      const { name, value } = (
        e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ).target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
    };
    console.log(dataToSubmit);

    try {
      const response = await fetch(`localhost:3000/perfil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        toast({
          title: "Voluntario registrado",
          description: "El voluntario se ha registrado exitosamente.",
        });
        router.push("/voluntarios");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Hubo un error al registrar el voluntario.",
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
                <Input
                  type="date"
                  id="fechaNac"
                  name="fechaNac"
                  value={formData.fechaNac}
                  onChange={(e) => handleChange(e)}
                  required
                />
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
                <Input
                  type="date"
                  id="fechaIngreso"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idCompania">Compañía</Label>
                <Select onValueChange={(value) => handleChange(value, "idCompania")} value={formData.idCompania}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione compañía" />
                  </SelectTrigger>
                  <SelectContent>
                    {companias.map((compania) => (
                      <SelectItem key={compania.id} value={compania.id.toString()}>
                        {compania.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cargoVoluntario">Cargo Voluntario</Label>
                <Select onValueChange={(value) => handleChange(value, "cargoVoluntario")} value={formData.cargoVoluntario}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargosVoluntario.map((cargo) => (
                      <SelectItem key={cargo} value={cargo}>
                        {cargo}
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
                <Select onValueChange={(value) => handleChange(value, "tipoSangre")} value={formData.tipoSangre}>
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

