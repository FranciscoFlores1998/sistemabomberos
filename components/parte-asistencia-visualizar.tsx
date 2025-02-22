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
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import logo from "@/public/logo/logo.png";
import logoC from "@/public/logo/logoCuerpo.png";

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  claveRadial: string;
  apellidop: string;
  apellidom: string;
}
interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}
interface Movil {
  idMovil: number;
  nomenclatura: string;
  especialidad: string;
}
interface ParteAsistenciaResponse {
  folioPAsistencia: number;
  aCargoDelCuerpo: number;
  encargadoCuerpo: Voluntario;
  aCargoDeLaCompania: number;
  encargadoCompania: Voluntario;
  fechaAsistencia: string;
  horaInicio: string;
  horaFin: string;
  direccionAsistencia: string;
  totalAsistencia: number;
  observaciones: string;
  idTipoLlamado: number;
  tipoLlamado: TipoCitacion;
  voluntarios: Voluntario[];
  moviles: Movil[];
}

export default function VisualizarParteAsistencia({
  folio,
}: {
  folio: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parteAsistencia, setParteAsistencia] =
    useState<ParteAsistenciaResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/buscar/${folio}`,
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
          console.log("mostrar", data);
          setParteAsistencia(data);
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

    // Aplicar estilos específicos para PDF antes de generar
    element.classList.add("pdf-mode");

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff", // Asegura un fondo blanco
      width:1100,
    });

    // Remover estilos específicos para PDF después de generar
    element.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 35;
    
    const imgWidth = pdfWidth - (2*margin);
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const position = page * pdfHeight;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        -position,
        pdfWidth,
        imgHeight * ratio
      );
            pdf.setFontSize(10);
      pdf.text(`Página ${page + 1} de ${totalPages}`, pdfWidth / 2, pdfHeight - 5, { align: 'left' });
    }
    pdf.save(`parte-asistencia-${folio}.pdf`);
  };

  if (loading) {
    return <FallbackSpinner />;
  }

  if (!parteAsistencia) {
    return <div>No se encontró el parte de asistencia.</div>;
  }
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };
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
        .pdf-mode .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #3b82f6;
        }
        .pdf-mode .logo1 {
          width: 100px;
          height: 170px;
        }
        .pdf-mode .logo2 {
          width: 130px;
          height: 130px;
        }
        .pdf-mode h2 {
          color: #1e40af;
          font-size: 24px;
          margin-bottom: 10px;
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
        <div className="header">
            <div className="flex justify-between items-center w-full">
              <Image
                src={logo || "/placeholder.svg"}
                alt="Logo de la organización"
                width={100}
                height={170}
                className="logo1"
              />
              <h1>Parte de Asistencia número {folio}</h1>
              <Image
                src={logoC || "/placeholder.svg"}
                alt="Logo de la organización"
                width={130}
                height={130}
                className="logo2"
              />
            </div>
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center">
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Tipo de Citación</h3>
                <p>{parteAsistencia.tipoLlamado.nombreTipoLlamado}</p>
              </div>
              <div className="full-width grid grid-cols-3 gap-4 pdf-mode grid three-columns">
                <div>
                  <h3 className="text-lg font-semibold">Fecha</h3>
                  <p>{formatDate(parteAsistencia.fechaAsistencia)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Hora de Inicio</h3>
                  <p>{parteAsistencia.horaInicio}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Hora de Fin</h3>
                  <p>{parteAsistencia.horaFin}</p>
                </div>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">
                  Oficial a cargo del cuerpo
                </h3>
                <p>
                  {parteAsistencia.encargadoCuerpo.claveRadial}{" "}
                  {parteAsistencia.encargadoCuerpo.nombreVol}{" "}
                  {parteAsistencia.encargadoCuerpo.apellidop}{" "}
                  {parteAsistencia.encargadoCuerpo.apellidom}
                </p>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Oficial Compañía</h3>
                <p>
                  {parteAsistencia.encargadoCompania.claveRadial}{" "}
                  {parteAsistencia.encargadoCompania.nombreVol}{" "}
                  {parteAsistencia.encargadoCompania.apellidop}{" "}
                  {parteAsistencia.encargadoCompania.apellidom}
                </p>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Dirección</h3>
                <p>{parteAsistencia.direccionAsistencia}</p>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Observaciones</h3>
                <p>{parteAsistencia.observaciones || "Sin observaciones"}</p>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Móviles</h3>
                {parteAsistencia.moviles &&
                parteAsistencia.moviles.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {parteAsistencia.moviles.map((movil) => (
                      <li key={movil.idMovil}>
                        {movil.nomenclatura} - {movil.especialidad}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No hay móviles registrados para este parte de asistencia.
                  </p>
                )}
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Voluntarios</h3>
                {parteAsistencia.voluntarios &&
                parteAsistencia.voluntarios.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {parteAsistencia.voluntarios.map((voluntario) => (
                      <li key={voluntario.idVoluntario}>
                        {voluntario.claveRadial} {voluntario.nombreVol}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No hay voluntarios registrados para este parte de
                    asistencia.
                  </p>
                )}
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Total Asistencia</h3>
                <p>{parteAsistencia.totalAsistencia}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4"></CardFooter>
        </div>
      </Card>
      <div className="flex justify-between mt-4">
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
    </div>
    </div>
  );
}
