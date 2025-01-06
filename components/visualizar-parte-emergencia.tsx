"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

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

export default function VisualizarParteEmergencia({ params }: { params: { folio: string } }) {
  const [emergencyReport, setEmergencyReport] = useState<ParteEmergencia | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${params.folio}`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmergencyReport(data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar los datos del parte de emergencia",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.folio]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!emergencyReport) {
    return <div>No se encontró el parte de emergencia</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Parte de Emergencia - Folio: {emergencyReport.folioPEmergencia}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div>
              <strong>Hora de Inicio:</strong> {emergencyReport.horaInicio}
            </div>
            <div>
              <strong>Hora de Fin:</strong> {emergencyReport.horaFin}
            </div>
            <div>
              <strong>Fecha:</strong> {emergencyReport.fechaEmergencia}
            </div>
            <div>
              <strong>Pre-Informe:</strong>
              <p>{emergencyReport.preInforme}</p>
            </div>
            <div>
              <strong>Llamar Empresa Química:</strong> {emergencyReport.llamarEmpresaQuimica ? 'Sí' : 'No'}
            </div>
            <div>
              <strong>Descripción material peligroso:</strong>
              <p>{emergencyReport.descripcionMaterialP}</p>
            </div>
            <div>
              <strong>Dirección de Emergencia:</strong> {emergencyReport.direccionEmergencia}
            </div>
            <div>
              <strong>ID Oficial:</strong> {emergencyReport.idOficial}
            </div>
            <div>
              <strong>ID Clave Emergencia:</strong> {emergencyReport.idClaveEmergencia}
            </div>
            <div>
              <strong>Folio P. Asistencia:</strong> {emergencyReport.folioPAsistencia}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button onClick={() => router.push(`/parte-emergencia/editar/${params.folio}`)}>
            Editar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}