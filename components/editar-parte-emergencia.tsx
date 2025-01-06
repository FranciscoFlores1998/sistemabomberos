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
import { useRouter } from "next/navigation";


interface ParteEmergencia {
  folioPEmergencia: number;
  horaInicio: string;
  horaFin: string;
  fechaEmergencia: string;
  preInforme: string;
  llamarEmpresaQuimica: boolean;
  descripcionMaterialP: string;
  direccionEmergencia: string;
  idOficial: string;
  idClaveEmergencia: string;
  folioPAsistencia: string;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

export default function EditarParteEmergencia({params}: {params: {folio:string} }) {
  const [date, setDate] = useState<Date>(new Date());
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [clavesEmergencia, setClavesEmergencia] = useState<ClaveEmergencia[]>([]);
  const router = useRouter();
  const [formData, setFormData] = useState<ParteEmergencia>({
    folioPEmergencia: 0,
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
    formData.fechaEmergencia = formatearFecha(date.toISOString());

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/actualizar/${params.folio}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Parte de emergencia actualizado",
          description: "El parte de emergencia se ha actualizado exitosamente.",
        });
        router.push("/parte-emergencia");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error || "Hubo un error al actualizar el parte de emergencia.",
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
    const fetchData = async () => {
        console.log(params)
        if (!params) return;
      try {
        const [parteEmergenciaRes, parteAsistenciaRes, voluntariosRes, clavesEmergenciaRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${params.folio}`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
        ]);

        if (parteEmergenciaRes.ok && parteAsistenciaRes.ok && voluntariosRes.ok && clavesEmergenciaRes.ok) {
          const [parteEmergenciaData, parteAsistenciaData, voluntariosData, clavesEmergenciaData] = await Promise.all([
            parteEmergenciaRes.json(),
            parteAsistenciaRes.json(),
            voluntariosRes.json(),
            clavesEmergenciaRes.json(),
          ]);

          setFormData(parteEmergenciaData);
          setParteAsistenciaOptions(parteAsistenciaData);
          setVoluntarios(voluntariosData);
          setClavesEmergencia(clavesEmergenciaData);
          setDate(new Date(parteEmergenciaData.fechaEmergencia));
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar los datos necesarios",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [params.folio]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Parte de Emergencia</CardTitle>
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
                <Label htmlFor="descripcionMaterialP">Descripción material peligroso</Label>
                <Textarea
                  id="descripcionMaterialP"
                  name="descripcionMaterialP"
                  value={formData.descripcionMaterialP}
                  onChange={handleChange}
                  required
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
                    {clavesEmergencia.map((option) => (
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
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

