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

interface ParteEmergencia {
  folioPEmergencia: number;
  horaInicio: string;
  horaFin: string;
  fechaEmergencia: string;
  preInforme: string;
  llamarEmpresaQuimica: boolean | null;
  descripcionMaterialP: string;
  folioPAsistencia: number | null;
  direccionEmergencia: string;
  idOficial: number;
  idClaveEmergencia: number;
}

export default function ParteEmergencia() {
  const [parteEmergenciaOptions, setParteEmergenciaOptions] = useState<ParteEmergencia[]>([]);

  useEffect(() => {
    const obtenerParteEmergencia = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/obtener`,
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
        setParteEmergenciaOptions(data);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error ||
            "Hubo un error al obtener el parte de emergencia.",
          variant: "destructive",
        });
      }
    };
    obtenerParteEmergencia();
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
        <h1 className="text-2xl font-bold mb-4">Parte de Emergencia</h1>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Lista de partes de emergencia</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Folio</TableHead>
                <TableHead>Hora Inicio</TableHead>
                <TableHead>Hora Fin</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Pre-Informe</TableHead>
                <TableHead>Llamar Empresa Química</TableHead>
                <TableHead>Descripción Material Peligroso</TableHead>
                <TableHead>Folio P. Asistencia</TableHead>
                <TableHead>Dirección Emergencia</TableHead>
                <TableHead>ID Oficial</TableHead>
                <TableHead>ID Clave Emergencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parteEmergenciaOptions.map((parte) => (
                <TableRow key={parte.folioPEmergencia}>
                  <TableCell>{parte.folioPEmergencia}</TableCell>
                  <TableCell>{parte.horaInicio}</TableCell>
                  <TableCell>{parte.horaFin}</TableCell>
                  <TableCell>{parte.fechaEmergencia}</TableCell>
                  <TableCell>{parte.preInforme}</TableCell>
                  <TableCell>{parte.llamarEmpresaQuimica === null ? 'N/A' : parte.llamarEmpresaQuimica ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{parte.descripcionMaterialP}</TableCell>
                  <TableCell>{parte.folioPAsistencia || 'N/A'}</TableCell>
                  <TableCell>{parte.direccionEmergencia}</TableCell>
                  <TableCell>{parte.idOficial}</TableCell>
                  <TableCell>{parte.idClaveEmergencia}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
