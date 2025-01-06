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
import { Checkbox } from "@/components/ui/checkbox";

interface MaterialPeligroso {
  idMaterialP: number;
  clasificacion: string;
}

export default function CrearParteEmergencia() {
  const [date, setDate] = useState<Date>(new Date());
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState([]);
  const [materialesPeligrosos, setMaterialesPeligrosos] = useState<MaterialPeligroso[]>([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    horaInicio: "",
    horaFin: "",
    fechaEmergencia: "",
    preInforme: "",
    llamarEmpresaQuimica: false,
    descripcionMaterialP: "",
    direccionEmergencia: "",
    idOficial: "",
    idClaveEmergencia: "",
    folioPAsistencia: "",
  });

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
    console.log(formData);
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
        toast({
          title: "Parte de emergencia creado",
          description: "El parte de emergencia se ha creado exitosamente.",
        });
        router.push("/parte-emergencia");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error || "Hubo un error al crear el parte de emergencia.",
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
    const obtenerParteAsistencia = async () => {
      const response = await fetch("/api/parte-asistencia/obtener");
      if (response.ok) {
        const data = await response.json();
        setParteAsistenciaOptions(data);
      }
    };

    const obtenerMaterialesPeligrosos = async () => {
      const response = await fetch("/api/materialP/obtener");
      if (response.ok) {
        const data = await response.json();
        setMaterialesPeligrosos(data);
      }
    };

    obtenerParteAsistencia();
    obtenerMaterialesPeligrosos();
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
              <div>
                <Label>Hora de Inicio</Label>
                <Input
                  name="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Hora de Fin</Label>
                <Input
                  name="horaFin"
                  type="time"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Fecha</Label>
                <DatePicker
                  date={date}
                  setDate={(date) => setDate(date || new Date())}
                />
              </div>
              <div>
                <Label>Pre-Informe</Label>
                <Textarea
                  name="preInforme"
                  value={formData.preInforme}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Descripción Material Peligroso</Label>
                <Textarea
                  name="descripcionMaterialP"
                  value={formData.descripcionMaterialP}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Dirección Emergencia</Label>
                <Input
                  name="direccionEmergencia"
                  value={formData.direccionEmergencia}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>ID Oficial</Label>
                <Input
                  name="idOficial"
                  type="number"
                  value={formData.idOficial}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>ID Clave Emergencia</Label>
                <Input
                  name="idClaveEmergencia"
                  type="number"
                  value={formData.idClaveEmergencia}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Folio P. Asistencia</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "folioPAsistencia")
                  }
                  value={formData.folioPAsistencia}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un folio" />
                  </SelectTrigger>
                  <SelectContent>
                    {parteAsistenciaOptions.map((option) => (
                      <SelectItem
                        key={option.folioPAsistencia}
                        value={option.folioPAsistencia.toString()}
                      >
                        {option.folioPAsistencia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.llamarEmpresaQuimica}
                  onCheckedChange={(checked) =>
                    handleChange(checked, "llamarEmpresaQuimica")
                  }
                />
                <Label>Llamar Empresa Química</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Crear Parte de Emergencia</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
