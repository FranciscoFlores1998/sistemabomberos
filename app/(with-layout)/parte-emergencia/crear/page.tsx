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

export default function CrearParteEmergencia() {
  const [date, setDate] = useState<Date>(new Date());
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    tipoEmergencia: "",
    horaInicio: "",
    horaFin: "",
    fechaEmergencia: "",
    preInforme: "",
    oficial: "",
    folioPAsistencia: "",
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
                <Label htmlFor="tipoEmergencia">Tipo de Emergencia</Label>
                <Input
                  id="tipoEmergencia"
                  name="tipoEmergencia"
                  value={formData.tipoEmergencia}
                  onChange={handleChange}
                  required
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="oficial">Oficial</Label>
                <Input
                  id="oficial"
                  name="oficial"
                  value={formData.oficial}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                {/* <Label htmlFor="folioPAsistencia">Folio P. Asistencia</Label>
                <Input
                  id="folioPAsistencia"
                  name="folioPAsistencia"
                  value={formData.folioPAsistencia}
                  onChange={handleChange}
                  required
                /> */}
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
          <Button onClick={handleSubmit}>Crear Parte de Emergencia</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
