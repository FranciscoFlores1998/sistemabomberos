'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from 'lucide-react';

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

export default function Busqueda() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [voluntario, setVoluntario] = useState<VoluntarioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoluntario = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntarios?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch volunteer data');
      }
      const data = await response.json();
      setVoluntario(data);
    } catch (err) {
      setError('Error fetching volunteer data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchVoluntario(searchTerm);
  };

  const handleCreateVolunteer = () => {
    router.push('/voluntario/crear');
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Voluntarios</CardTitle>
          <Button onClick={handleCreateVolunteer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Crear Voluntario
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre o RUT"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="w-full max-w-2xl mx-auto mb-6">
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {voluntario && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Datos del Voluntario</CardTitle>
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
              <DataItem label="Cargo Voluntario" value={voluntario.idCargo.toString()} />
              <DataItem label="RUT Voluntario" value={voluntario.rutVoluntario} />
              <DataItem label="ID Compañía" value={voluntario.idCompania} />
              <DataItem label="ID Usuario" value={voluntario.idUsuario || "No asignado"} />
            </div>
          </CardContent>
        </Card>
      )}
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

