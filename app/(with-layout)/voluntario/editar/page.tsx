"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoluntarioData {
  idVoluntario: number;
  nombreVol: string;
  fechaNac: string;
  direccion: string;
  numeroContacto: string;
  tipoSangre: string;
  enfermedades: string;
  alergias: string;
  fechaIngreso: string;
  claveRadial: string;
  cargoVoluntario: string;
  rutVoluntario: string;
  idCompania: string;
  idUsuario: string;
}

const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const cargosVoluntario = ['Bombero', 'Conductor', 'Oficial', 'Comandante'];
const companias = [
  { id: 1, nombre: 'Compañía 1' },
  { id: 2, nombre: 'Compañía 2' },
  { id: 3, nombre: 'Compañía 3' },
];

export default function VoluntarioEdicion({ voluntarioId }: { voluntarioId: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [voluntario, setVoluntario] = useState<VoluntarioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVoluntario = async () => {
      try {
        const response = await fetch(`/api/voluntario/${voluntarioId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch voluntario');
        }
        const data = await response.json();
        setVoluntario(data);
      } catch (error) {
        console.error('Error fetching voluntario:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar los datos del voluntario.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoluntario();
  }, [voluntarioId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    name?: string
  ) => {
    if (!voluntario) return;

    if (typeof e === "string" && name) {
      setVoluntario({ ...voluntario, [name]: e });
    } else {
      const { name, value } = e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      setVoluntario({ ...voluntario, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voluntario) return;

    try {
      const response = await fetch(`/api/voluntario/${voluntarioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voluntario),
      });

      if (response.ok) {
        toast({
          title: "Voluntario actualizado",
          description: "Los datos del voluntario se han actualizado exitosamente.",
        });
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Hubo un error al actualizar el voluntario.",
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p>Cargando datos del voluntario...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!voluntario) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p>No se encontraron datos del voluntario.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Editar Voluntario" : "Datos del Voluntario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nombreVol">Nombre</Label>
                {isEditing ? (
                  <Input
                    id="nombreVol"
                    name="nombreVol"
                    value={voluntario.nombreVol}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.nombreVol}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                {isEditing ? (
                  <Input
                    id="fechaNac"
                    name="fechaNac"
                    type="date"
                    value={voluntario.fechaNac}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.fechaNac}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="direccion">Dirección</Label>
                {isEditing ? (
                  <Input
                    id="direccion"
                    name="direccion"
                    value={voluntario.direccion}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.direccion}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="numeroContacto">Número de Contacto</Label>
                {isEditing ? (
                  <Input
                    id="numeroContacto"
                    name="numeroContacto"
                    value={voluntario.numeroContacto}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.numeroContacto}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                {isEditing ? (
                  <Select 
                    onValueChange={(value) => handleChange(value, "tipoSangre")} 
                    value={voluntario.tipoSangre}
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
                ) : (
                  <p>{voluntario.tipoSangre}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="enfermedades">Enfermedades</Label>
                {isEditing ? (
                  <Textarea
                    id="enfermedades"
                    name="enfermedades"
                    value={voluntario.enfermedades}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{voluntario.enfermedades || "Ninguna"}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="alergias">Alergias</Label>
                {isEditing ? (
                  <Textarea
                    id="alergias"
                    name="alergias"
                    value={voluntario.alergias}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{voluntario.alergias || "Ninguna"}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                {isEditing ? (
                  <Input
                    id="fechaIngreso"
                    name="fechaIngreso"
                    type="date"
                    value={voluntario.fechaIngreso}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.fechaIngreso}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="claveRadial">Clave Radial</Label>
                {isEditing ? (
                  <Input
                    id="claveRadial"
                    name="claveRadial"
                    value={voluntario.claveRadial}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.claveRadial}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cargoVoluntario">Cargo Voluntario</Label>
                {isEditing ? (
                  <Select 
                    onValueChange={(value) => handleChange(value, "cargoVoluntario")} 
                    value={voluntario.cargoVoluntario}
                  >
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
                ) : (
                  <p>{voluntario.cargoVoluntario}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rutVoluntario">RUT Voluntario</Label>
                {isEditing ? (
                  <Input
                    id="rutVoluntario"
                    name="rutVoluntario"
                    value={voluntario.rutVoluntario}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p>{voluntario.rutVoluntario}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idCompania">Compañía</Label>
                {isEditing ? (
                  <Select 
                    onValueChange={(value) => handleChange(value, "idCompania")} 
                    value={voluntario.idCompania}
                  >
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
                ) : (
                  <p>{companias.find(c => c.id.toString() === voluntario.idCompania)?.nombre || voluntario.idCompania}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idUsuario">ID Usuario</Label>
                <p>{voluntario.idUsuario || "No asignado"}</p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Guardar Cambios</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => router.back()}>
                Volver
              </Button>
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

