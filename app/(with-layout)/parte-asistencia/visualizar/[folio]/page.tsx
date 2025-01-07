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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Visualizar Parte de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Tipo de llamado</h3>
              <p>{getTipoCitacionNombre(parteAsistencia.idTipoLlamado)}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Dirección</h3>
              <p>{parteAsistencia.direccionAsistencia}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Hora de Inicio</h3>
              <p>{parteAsistencia.horaInicio}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Hora de Fin</h3>
              <p>{parteAsistencia.horaFin}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Fecha de Asistencia</h3>
              <p>{formatearFecha(parteAsistencia.fechaAsistencia)}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Observaciones</h3>
              <p>{parteAsistencia.observaciones}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Oficial a cargo del cuerpo</h3>
              <p>{voluntarios.find(oCuerpo => oCuerpo.idVoluntario === parseInt(parteAsistencia.aCargoDelCuerpo))?.nombreVol}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Oficial a cargo de la compañía</h3>
              <p>{voluntarios.find(oCompania => oCompania.idVoluntario === parseInt(parteAsistencia.aCargoDeLaCompania))?.nombreVol}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold">Total de asistencia</h3>
              <p>{parteAsistencia.totalAsistencia}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
