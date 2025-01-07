'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import cookie from "js-cookie";

interface VoluntarioData {
  idVoluntario: number;
  nombreVol: string;
  fechaNac: string;
  direccion: string;
  numeroContacto: string;
  tipoSangre: string;
  enfermedades: string;
  alergias: string;
  fechaIngreso: string;
  claveRadial: string;
  rutVoluntario: string;
  idCompania: string;
  idUsuario: string;
  idCargo: number;
}

export default function Voluntario() {
  const router = useRouter();
  const [voluntario, setVoluntario] = useState<VoluntarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const voluntarioSesion = cookie.get("login");
  console.log(voluntarioSesion);
  const parsedVoluntario = voluntarioSesion ? JSON.parse(voluntarioSesion) : null;
  useEffect(() => {
    const fetchLoggedInVoluntario = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/buscar-por-usuario/${parsedVoluntario.usuario.idUsuario}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch logged-in volunteer data');
        }
        const data = await response.json();
        setVoluntario(data);
      } catch (err) {
        setError('Error fetching your data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInVoluntario();
  }, []);

  const handleEditar = () => {
    if (voluntario) {
      router.push(`/voluntario/editar/${voluntario.idVoluntario}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">Cargando datos del voluntario...</p>
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

  if (!voluntario) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">No se encontraron datos del voluntario.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mis Datos de Voluntario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <DataItem label="Nombre" value={voluntario.nombreVol} />
            <DataItem label="Fecha de Nacimiento" value={voluntario.fechaNac} />
            <DataItem label="Dirección" value={voluntario.direccion} />
            <DataItem label="Número de Contacto" value={voluntario.numeroContacto} />
            <DataItem label="Tipo de Sangre" value={voluntario.tipoSangre} />
            <DataItem label="Enfermedades" value={voluntario.enfermedades || "Ninguna"} />
            <DataItem label="Alergias" value={voluntario.alergias || "Ninguna"} />
            <DataItem label="Fecha de Ingreso" value={voluntario.fechaIngreso} />
            <DataItem label="Clave Radial" value={voluntario.claveRadial} />
            <DataItem label="Cargo Voluntario" value={voluntario.idCargo.toExponential()} />
            <DataItem label="RUT Voluntario" value={voluntario.rutVoluntario} />
            <DataItem label="Compañía" value={voluntario.idCompania} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleEditar}>Editar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <span className="font-semibold text-sm text-gray-500">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  );
}

