"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FallbackSpinner from "@/components/ui/spinner";
import { formatearFecha } from "@/lib/formatearFecha";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface Cargo {
  idCargo: number;
  nombreCarg: string;
}

interface Compania {
  idCompania: number;
  nombreCia: string;
  direccionCia: string;
  especialidad: string;
  idCuerpo: number;
}

interface Volunteer {
  idVoluntario: number;
  nombreVol: string;
  fechaNac: string;
  fechaIngreso: string;
  direccion: string;
  numeroContacto: string;
  tipoSangre: string;
  enfermedades: string;
  alergias: string;
  claveRadial: string;
  rutVoluntario: string;
  idCompania: number;
  idUsuario: number | null;
  idCargo: number;
  apellidop: string;
  apellidom: string;
  activo: boolean;
  compania: Compania;
  cargo: Cargo;
}

export default function VolunteerViewer({ id }: { id: string }) {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("VolunteerViewer id:", id);
    const fetchVolunteer = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/voluntario/buscar-por-usuario/${id}`,
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
          setVolunteer(data);
        } else {
          toast.error("Hubo un error al cargar los datos del voluntario.");
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
        toast.error("Hubo un error al cargar los datos del voluntario.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, [id]);

  if (loading) {
    return <FallbackSpinner />;
  }

  if (!volunteer) {
    return <div>No se encontró el voluntario.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Información del Voluntario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <Card className="w-full pt-3">
              <CardContent>
                <h6 className="text-lg font-semibold pb-3">Datos Personales</h6>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-bold">Apellidos:</Label>
                    <p>{`${volunteer.apellidop} ${volunteer.apellidom}`}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Nombres:</Label>
                    <p>{`${volunteer.nombreVol}`}</p>
                  </div>
                  <div>
                    <Label className="font-bold">RUT:</Label>
                    <p>{volunteer.rutVoluntario}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Fecha de Nacimiento:</Label>
                    <p>{formatearFecha(volunteer.fechaNac)}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Dirección:</Label>
                    <p>{volunteer.direccion}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Número de Contacto:</Label>
                    <p>{volunteer.numeroContacto}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Tipo de Sangre:</Label>
                    <p>{volunteer.tipoSangre || "No especificado"}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Enfermedades:</Label>
                    <p>{volunteer.enfermedades || "Ninguna"}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Alergias:</Label>
                    <p>{volunteer.alergias || "Ninguna"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full pt-3">
              <CardContent>
                <h6 className="text-lg font-semibold pb-3">Datos de Bombero</h6>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-bold">Estado:</Label>
                    <p>{volunteer.activo ? "Activo" : "Inactivo"}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Clave Radial:</Label>
                    <p>{volunteer.claveRadial}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Fecha de Ingreso:</Label>
                    <p>{formatearFecha(volunteer.fechaIngreso)}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Compañía:</Label>
                    <p>{volunteer.compania.nombreCia}</p>
                  </div>
                  <div>
                    <Label className="font-bold">Cargo:</Label>
                    <p>{volunteer.cargo.nombreCarg}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.back()}>Volver</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

