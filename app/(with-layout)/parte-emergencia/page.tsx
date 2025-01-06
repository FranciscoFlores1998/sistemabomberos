'use client'

import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
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
  nombreClaveEmergencia?: string;
}

export default function ParteEmergencia() {
  const [parteEmergenciaOptions, setParteEmergenciaOptions] = useState<ParteEmergencia[]>([]);
  const router = useRouter();

  useEffect(() => {
    const obtenerParteEmergencia = async () => {
      try {
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
          const data: ParteEmergencia[] = await response.json();
          
          // Fetch the name for each emergency key
          const partesConNombres = await Promise.all(data.map(async (parte) => {
            const nombreClave = await obtenerNombreClaveEmergencia(parte.idClaveEmergencia);
            return { ...parte, nombreClaveEmergencia: nombreClave };
          }));

          setParteEmergenciaOptions(partesConNombres);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Hubo un error al obtener el parte de emergencia.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Hubo un error al obtener el parte de emergencia.",
          variant: "destructive",
        });
      }
    };

    obtenerParteEmergencia();
  }, []);

  const obtenerNombreClaveEmergencia = async (id: number): Promise<string> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/buscar/${id}`,
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
        return data.nombreClaveEmergencia;
      } else {
        throw new Error("No se pudo obtener el nombre de la clave de emergencia");
      }
    } catch (error) {
      console.error("Error al obtener el nombre de la clave de emergencia:", error);
      return "Desconocido";
    }
  };

  const handleCrearParte = () => {
    router.push('/parte-emergencia/crear');
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
                <TableHead>Clave Emergencia</TableHead>
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
                  <TableCell>{parte.nombreClaveEmergencia || 'Desconocido'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

