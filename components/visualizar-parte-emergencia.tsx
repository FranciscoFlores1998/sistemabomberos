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

interface Oficial {
  idOficial: number;
  nombreVol: string;
  apellidop: string;
  apellidom: string;
  claveRadial: string;
}
interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  claveRadial: string;
  apellidop: string;
  apellidom: string;
}
interface Movil {
  idMovil: number;
  nomenclatura: string;
  especialidad: string;
}
interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}
interface Inmueble {
  direccion: String;
  tipoInmueble: String;
  estadoInmueble: String;
}
interface Institucion {
  nombreInstitucion: String;
  tipoInstitucion: String;
  nombrePersonaCargo: String;
  horaLlegada: String;
}
interface Vehiculo {
  idVehiculo: number;
  marca: String;
  modelo: String;
  patente: String;
  tipoVehiculo: String;
}
interface Victima {
  nombreVictima: String;
  rutVictima: String;
  edadVictima: number;
  descripcion: String;
}
interface Material {
  clasificacion: String;
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
  materialesP: Material[];
  voluntarios: Voluntario[];
  moviles: Movil[];
  victimas: Victima[];
  instituciones: Institucion[];
  inmuebles: Inmueble[];
  vehiculos: Vehiculo[];
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
      width: 1100,
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
    const margin = 35;

    const imgWidth = pdfWidth - 2 * margin;
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
      pdf.text(
        `Página ${page + 1} de ${totalPages}`,
        pdfWidth / 2,
        pdfHeight - 5,
        { align: "left" }
      );
    }
    pdf.save(`parte-emergencia-${folio}.pdf`);
  };

  if (loading) {
    return <FallbackSpinner />;
  }

  if (!parteEmergencia) {
    return <div>No se encontró el parte de emergencia.</div>;
  }
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
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
              <h1>Parte de Emergencia número {folio}</h1>
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
            <CardTitle className="text-2xl font-bold text-center"></CardTitle>
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
                  <p>
                    {parteEmergencia.folioPAsistencia ||
                      "No se aplico parte de asistencia"}
                  </p>
                </div>
              </div>
              <div className="full-width grid grid-cols-3 gap-4 pdf-mode grid three-columns">
                <div>
                  <h3 className="text-lg font-semibold">Fecha</h3>
                  <p>{formatDate(parteEmergencia.fechaEmergencia)}</p>
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
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Oficial a cargo</h3>
                <p>
                  {parteEmergencia.oficial.claveRadial}{" "}
                  {parteEmergencia.oficial.nombreVol}{" "}
                  {parteEmergencia.oficial.apellidop}{" "}
                  {parteEmergencia.oficial.apellidom}
                </p>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Dirección</h3>
                <p>{parteEmergencia.direccionEmergencia}</p>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Pre-Informe</h3>
                <p>{parteEmergencia.preInforme || "Sin pre-informe"}</p>
              </div>
              <div className="full-width grid grid-cols-3 gap-4 pdf-mode grid three-columns">
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
                <div>
                  <h3 className="text-lg font-semibold">
                    Clasificación del Material Peligroso
                  </h3>
                  <p>
                    {parteEmergencia.materialesP.length > 0
                      ? parteEmergencia.materialesP[0].clasificacion
                      : ""}
                  </p>
                </div>
              </div>
              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Víctimas</h3>
                {parteEmergencia.victimas.length > 0 ? (
                  <ul>
                    {parteEmergencia.victimas.map((victima, index) => (
                      <li key={index}>
                        {victima.nombreVictima} - RUT: {victima.rutVictima} -
                        Edad: {victima.edadVictima} - {victima.descripcion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No se registraron víctimas</p>
                )}
              </div>

              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Vehículos</h3>
                {parteEmergencia.vehiculos.length > 0 ? (
                  <ul>
                    {parteEmergencia.vehiculos.map((vehiculo, index) => (
                      <li key={index}>
                        {vehiculo.marca} {vehiculo.modelo} - Patente:{" "}
                        {vehiculo.patente} - Tipo: {vehiculo.tipoVehiculo}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No se registraron vehículos</p>
                )}
              </div>

              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Instituciones</h3>
                {parteEmergencia.instituciones.length > 0 ? (
                  <ul>
                    {parteEmergencia.instituciones.map((institucion, index) => (
                      <li key={index}>
                        {institucion.nombreInstitucion} - Tipo:{" "}
                        {institucion.tipoInstitucion} - Persona a cargo:{" "}
                        {institucion.nombrePersonaCargo} - Hora de llegada:{" "}
                        {institucion.horaLlegada}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No se registraron instituciones</p>
                )}
              </div>

              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Móviles</h3>
                {parteEmergencia.moviles.length > 0 ? (
                  <ul>
                    {parteEmergencia.moviles.map((movil, index) => (
                      <li key={index}>
                        {movil.nomenclatura} - Especialidad:{" "}
                        {movil.especialidad}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No se registraron móviles</p>
                )}
              </div>

              <div className="full-width pdf-mode grid">
                <h3 className="text-lg font-semibold">Voluntarios</h3>
                {parteEmergencia.voluntarios.length > 0 ? (
                  <ul>
                    {parteEmergencia.voluntarios.map((voluntario, index) => (
                      <li key={index}>
                        {voluntario.claveRadial} - {voluntario.nombreVol}{" "}
                        {voluntario.apellidop} {voluntario.apellidom}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No se registraron voluntarios</p>
                )}
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
