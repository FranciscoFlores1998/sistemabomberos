"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface MaterialPeligroso {
  idMaterialP: number;
  clasificacion: string;
}

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

interface ParteAsistencia {
  folioPAsistencia: number;
  observaciones: string;
}

interface FormData {
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
  isDescripcionDisabled: boolean;
}

export default function CrearParteEmergencia() {
  const [date, setDate] = useState<Date>(new Date());
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState<ParteAsistencia[]>([]);
  const [materialesPeligrosos, setMaterialesPeligrosos] = useState<MaterialPeligroso[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [claveemergencia, setClaveEmergencia] = useState<ClaveEmergencia[]>([]);
  const [formData, setFormData] = useState<FormData>({
    horaInicio: "",
    horaFin: "",
    fechaEmergencia: "",
    preInforme: "",
    llamarEmpresaQuimica: false,
    descripcionMaterialP: "",
    direccionEmergencia: "",
    idOficial: "",
    idClaveEmergencia: "",
    folioPAsistencia: null,
    idMaterialP: null,
    isDescripcionDisabled: true,
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | boolean,
    name?: string
  ) => {
    if (typeof e === "boolean" && name) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e,
      }));
    } else if (typeof e === "string" && name) {
      if (name === "idMaterialP") {
        const isNoneSelected = e === "null";
        setFormData((prevState) => ({
          ...prevState,
          [name]: isNoneSelected ? null : e,
          isDescripcionDisabled: isNoneSelected,
          descripcionMaterialP: isNoneSelected ? "" : prevState.descripcionMaterialP,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: e === "null" ? null : e,
        }));
      }
    } else if (e && typeof e === 'object' && 'target' in e) {
      const { name, value } = e.target as HTMLInputElement;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado"); // Para verificar que la función se está ejecutando

    // Validación de campos requeridos
    const requiredFields = ['horaInicio', 'horaFin', 'preInforme', 'direccionEmergencia', 'idOficial', 'idClaveEmergencia'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);

    if (missingFields.length > 0) {
      console.log("Campos faltantes:", missingFields); // Para depuración
      toast({
        title: "Campos faltantes",
        description: `Por favor, complete los siguientes campos: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    console.log("Datos del formulario:", formData); // Para verificar los datos antes de enviar
    formData.fechaEmergencia = formatearFecha(date.toISOString());

    try {
      const response = await fetch("/api/parte-emergencia/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data); // Para verificar la respuesta del servidor

        toast({
          title: "Parte de emergencia guardado",
          description: "El parte de emergencia se ha guardado exitosamente.",
        });

        // Opcional: Limpiar el formulario después de guardar
        setFormData({
          horaInicio: "",
          horaFin: "",
          fechaEmergencia: "",
          preInforme: "",
          llamarEmpresaQuimica: false,
          descripcionMaterialP: "",
          direccionEmergencia: "",
          idOficial: "",
          idClaveEmergencia: "",
          folioPAsistencia: null,
          idMaterialP: null,
          isDescripcionDisabled: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Hubo un error al crear el parte de emergencia.");
      }
    } catch (error) {
      console.error("Error al guardar:", error); // Para depuración
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al conectar con el servidor.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const obtenerParteAsistencia = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`,
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
        console.log(data);
        setParteAsistenciaOptions(data);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error ||
            "Hubo un error al obtener el parte de asistencia.",
          variant: "destructive",
        });
      }
    };

    const obtenerMaterialesPeligrosos = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materialP/obtener`,
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
        console.log(data);
        setMaterialesPeligrosos(data);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error ||
            "Hubo un error al obtener los materiales peligrosos.",
          variant: "destructive",
        });
      }
    };

    const obtenerVoluntarios = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`,
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
        console.log(data);
        setVoluntarios(data);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error ||
            "Hubo un error al obtener los voluntarios.",
          variant: "destructive",
        });
      }
    };

    const obtenerClaveEmergencia = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`,
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
        console.log(data);
        setClaveEmergencia(data);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error ||
            "Hubo un error al obtener claveEmergencia.",
          variant: "destructive",
        });
      }
    };

    obtenerClaveEmergencia();
    obtenerVoluntarios();
    obtenerMaterialesPeligrosos();
    obtenerParteAsistencia();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Parte de Emergencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="horaInicio">Hora de Inicio</Label>
                <Input
                  id="horaInicio"
                  name="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="horaFin">Hora de Fin</Label>
                <Input
                  id="horaFin"
                  name="horaFin"
                  type="time"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaEmergencia">Fecha</Label>
                <DatePicker
                  date={date}
                  setDate={(date) => setDate(date || new Date())}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="preInforme">Pre-Informe</Label>
                <Textarea
                  id="preInforme"
                  name="preInforme"
                  value={formData.preInforme}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="llamarEmpresaQuimica"
                  checked={formData.llamarEmpresaQuimica}
                  onCheckedChange={(checked) =>
                    handleChange(checked, "llamarEmpresaQuimica")
                  }
                />
                <Label htmlFor="llamarEmpresaQuimica">Llamar Empresa Química</Label>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idMaterialP">Material Peligroso</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "idMaterialP")
                  }
                  value={formData.idMaterialP === null ? "null" : formData.idMaterialP}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un Material Peligroso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Ninguno</SelectItem>
                    {materialesPeligrosos.map((material) => (
                      <SelectItem
                        key={material.idMaterialP}
                        value={material.idMaterialP.toString()}
                      >
                        {material.idMaterialP} - {material.clasificacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="descripcionMaterialP">Descripción material peligroso</Label>
                <Textarea
                  id="descripcionMaterialP"
                  name="descripcionMaterialP"
                  value={formData.descripcionMaterialP}
                  onChange={handleChange}
                  disabled={formData.isDescripcionDisabled}
                  required={!formData.isDescripcionDisabled}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="direccionEmergencia">Dirección de Emergencia</Label>
                <Input
                  id="direccionEmergencia"
                  name="direccionEmergencia"
                  value={formData.direccionEmergencia}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idOficial">Oficial</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "idOficial")
                  }
                  value={formData.idOficial}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un Oficial" />
                  </SelectTrigger>
                  <SelectContent>
                    {voluntarios.map((option) => (
                      <SelectItem
                        key={option.idVoluntario}
                        value={option.idVoluntario.toString()}
                      >
                        {option.idVoluntario} - {option.nombreVol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idClaveEmergencia">Clave Emergencia</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "idClaveEmergencia")
                  }
                  value={formData.idClaveEmergencia}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione Clave Emergencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {claveemergencia.map((option) => (
                      <SelectItem
                        key={option.idClaveEmergencia}
                        value={option.idClaveEmergencia.toString()}
                      >
                        {option.idClaveEmergencia} - {option.nombreClaveEmergencia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="folioPAsistencia">Folio P. Asistencia</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "folioPAsistencia")
                  }
                  value={formData.folioPAsistencia === null ? "null" : formData.folioPAsistencia}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un folio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Ninguno</SelectItem>
                    {parteAsistenciaOptions.map((option) => (
                      <SelectItem
                        key={option.folioPAsistencia}
                        value={option.folioPAsistencia.toString()}
                      >
                        {option.folioPAsistencia} - {option.observaciones}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>Guardar Parte de Emergencia</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

