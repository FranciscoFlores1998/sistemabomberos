"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatearFecha } from "@/lib/formatearFecha";
import { usePDF } from 'react-to-pdf';
import { Download } from 'lucide-react';

interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}
interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
}
interface ParteAsistenciaData {
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

export default function VisualizarParteAsistencia() {
  const router = useRouter();
  const [parteAsistencia, setParteAsistencia] = useState<ParteAsistenciaData | null>(null);
  const [tipoCitacion, setTipoCitacion] = useState<TipoCitacion[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toPDF, targetRef } = usePDF({filename: 'parte-asistencia.pdf'});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const folio = window.location.pathname.split("/").pop();
        const [parteAsistenciaResponse, tipoCitacionResponse, voluntariosResponse] =
          await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/buscar/${folio}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true",
                },
              }
            ),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          })
        ]);
        if (!parteAsistenciaResponse.ok || !tipoCitacionResponse.ok || !voluntariosResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const [parteAsistenciaData, tipoCitacionData, voluntariosData] = await Promise.all([
          parteAsistenciaResponse.json(),
          tipoCitacionResponse.json(),
          voluntariosResponse.json()
        ]);
        setVoluntarios(voluntariosData);
        setParteAsistencia(parteAsistenciaData);
        setTipoCitacion(tipoCitacionData);
      } catch (err) {
        setError("Error fetching data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">
              Cargando datos del parte de asistencia...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!parteAsistencia) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">
              No se encontraron datos del parte de asistencia.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTipoCitacionNombre = (id: number) => {
    const tipo = tipoCitacion.find((t) => t.idTipoLlamado === id);
    return tipo ? tipo.nombreTipoLlamado : "Desconocido";
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Parte de Asistencia</CardTitle>
        </CardHeader>
        <CardContent  ref={targetRef}>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Folio</td>
                <td className="py-2 px-4">{parteAsistencia.folioPAsistencia}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Tipo de llamado</td>
                <td className="py-2 px-4">{getTipoCitacionNombre(parteAsistencia.idTipoLlamado)}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Dirección</td>
                <td className="py-2 px-4">{parteAsistencia.direccionAsistencia}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Hora de Inicio</td>
                <td className="py-2 px-4">{parteAsistencia.horaInicio}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Hora de Fin</td>
                <td className="py-2 px-4">{parteAsistencia.horaFin}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Fecha de Asistencia</td>
                <td className="py-2 px-4">{formatearFecha(parteAsistencia.fechaAsistencia)}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Observaciones</td>
                <td className="py-2 px-4">{parteAsistencia.observaciones}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Oficial a cargo del cuerpo</td>
                <td className="py-2 px-4">
                  {voluntarios.find(oCuerpo => oCuerpo.idVoluntario === parseInt(parteAsistencia.aCargoDelCuerpo))?.nombreVol}
                </td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold py-2 px-4">Oficial a cargo de la compañía</td>
                <td className="py-2 px-4">
                  {voluntarios.find(oCompania => oCompania.idVoluntario === parseInt(parteAsistencia.aCargoDeLaCompania))?.nombreVol}
                </td>
              </tr>
              <tr>
                <td className="font-semibold py-2 px-4">Total de asistencia</td>
                <td className="py-2 px-4">{parteAsistencia.totalAsistencia}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button onClick={() => toPDF()} className="bg-primary text-primary-foreground">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

