
'use client'
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface ParteAsistencia {
  folioPAsistencia: number;
  aCargoDelCuerpo: string;
  aCargoDeLaCompania: string;
  fechaAsistencia: string;
  horaInicio: string;
  horaFin: string;
  direccionAsistencia: string;
  totalAsistencia: number;
  observaciones: string;
  idTipoLlamado: number;
}

export default function ParteAsistencia() {
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState<ParteAsistencia[]>([]);

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

  const handleCrearParte = () => {
    console.log("Botón 'Crear Parte' presionado");

  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24 relative">
      <div className="w-full max-w-7xl mx-auto">
      <Button 
        onClick={handleCrearParte}
        className="absolute top-4 right-4"
      >
        Crear Parte
      </Button>
      <h1 className="text-2xl font-bold mb-4">Parte de Asitencia</h1>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableCaption>Lista de partes de asistencia</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Tipo de Llamado</TableHead>
            <TableHead>A Cargo del Cuerpo</TableHead>
            <TableHead>A Cargo de la Compañía</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora Inicio</TableHead>
            <TableHead>Hora Fin</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Total Asistencia</TableHead>
            <TableHead>Observaciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parteAsistenciaOptions.map((parte) => (
            <TableRow key={parte.folioPAsistencia}>
              <TableCell>{parte.folioPAsistencia}</TableCell>
              <TableCell>{parte.idTipoLlamado}</TableCell>
              <TableCell>{parte.aCargoDelCuerpo}</TableCell>
              <TableCell>{parte.aCargoDeLaCompania}</TableCell>
              <TableCell>{parte.fechaAsistencia}</TableCell>
              <TableCell>{parte.horaInicio}</TableCell>
              <TableCell>{parte.horaFin}</TableCell>
              <TableCell>{parte.direccionAsistencia}</TableCell>
              <TableCell>{parte.totalAsistencia}</TableCell>
              <TableCell>{parte.observaciones}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      </div>
    </div>
  )
}

