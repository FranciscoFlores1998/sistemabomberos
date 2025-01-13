"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FallbackSpinner from "@/components/ui/spinner";
import { formatearFecha } from "@/lib/formatearFecha";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface Oficial {
  idOficial: number;
  nombreOficial: string;
  apellidopOficial: string;
  apellidomOficial: string;
  claveRadial: string;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

interface ParteEmergenciaResponse {
  folioPEmergencia: number;
  horaInicio: string;
  horaFin: string;
  fechaEmergencia: string;
  preInforme: string;
  llamarEmpresaQuimica: boolean;
  descripcionMaterialP: string;
  direccionEmergencia: string;
  oficial: Oficial;
  claveEmergencia: ClaveEmergencia;
  folioPAsistencia: number;
}

export default function VisualizarParteEmergencia({
  folio,
}: {
  folio: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parteEmergencia, setParteEmergencia] =
    useState<ParteEmergenciaResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${folio}`,
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
          setParteEmergencia(data);
          console.log("mostrar", data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folio]);

  const generatePDF = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    element.classList.add("pdf-mode");

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    element.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save(`parte-emergencia-${folio}.pdf`);
  };

  if (loading) {
    return <FallbackSpinner />;
  }

  if (!parteEmergencia) {
    return <div>No se encontró el parte de emergencia.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-content,
          #pdf-content * {
            visibility: visible;
          }
          #pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        .pdf-mode {
          background-color: white;
          color: black;
          font-size: 12px;
        }
        .pdf-mode h3 {
          color: #1a202c;
          font-size: 16px;
          margin-bottom: 8px;
          padding: 8px;
          background-color: #f0f0f0;
          border-bottom: 1px solid #d1d1d1;
        }
        .pdf-mode p {
          margin-bottom: 8px;
          padding: 8px;
        }
        .pdf-mode .grid {
          display: grid;
          gap: 16px;
        }

        .pdf-mode .grid.two-columns {
          grid-template-columns: repeat(2, 1fr);
        }

        .pdf-mode .grid.three-columns {
          grid-template-columns: repeat(3, 1fr);
        }

        .pdf-mode .grid > div {
          border: 1px solid #d1d1d1;
          border-radius: 4px;
          padding: 8px;
          background-color: #f9f9f9;
        }
        .pdf-mode ul {
          padding-left: 20px;
        }
        .pdf-mode li {
          margin-bottom: 4px;
        }
        .pdf-mode .full-width {
          grid-column: 1 / -1;
        }
      `}</style>
      <Card className="w-full max-w-3xl mx-auto">
        <div id="pdf-content" className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              Parte de Emergencia número {folio}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="full-width grid gap-4 grid-cols-2 pdf-mode grid two-columns">
                <div>
                  <h3 className="text-lg font-semibold">Clave de Emergencia</h3>
                  <p>{parteEmergencia.claveEmergencia.nombreClaveEmergencia}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Folio Parte Asistencia
                  </h3>
                  <p>{parteEmergencia.folioPAsistencia}</p>
                </div>
              </div>
              <div className="full-width grid grid-cols-3 gap-4 pdf-mode grid three-columns">
                <div>
                  <h3 className="text-lg font-semibold">Fecha</h3>
                  <p>{formatearFecha(parteEmergencia.fechaEmergencia)}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Hora de Inicio</h3>
                  <p>{parteEmergencia.horaInicio}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Hora de Fin</h3>
                  <p>{parteEmergencia.horaFin}</p>
                </div>
              </div>
              <div className="full-width">
                <h3 className="text-lg font-semibold">Oficial a cargo</h3>
                <p>
                  {parteEmergencia.oficial.claveRadial}{" "}
                  {parteEmergencia.oficial.nombreOficial}{" "}
                  {parteEmergencia.oficial.apellidopOficial}{" "}
                  {parteEmergencia.oficial.apellidomOficial}
                </p>
              </div>
              <div className="full-width">
                <h3 className="text-lg font-semibold">Dirección</h3>
                <p>{parteEmergencia.direccionEmergencia}</p>
              </div>
              <div className="full-width">
                <h3 className="text-lg font-semibold">Pre-Informe</h3>
                <p>{parteEmergencia.preInforme || "Sin pre-informe"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Llamar Empresa Química
                </h3>
                <p>{parteEmergencia.llamarEmpresaQuimica ? "Sí" : "No"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Descripción Material Peligroso
                </h3>
                <p>
                  {parteEmergencia.descripcionMaterialP || "Sin descripción"}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
        <CardFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button
            onClick={generatePDF}
            className="bg-primary text-primary-foreground"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
