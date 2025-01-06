"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ParteAsistencia {
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

interface TipoCitacion {
  idTipoLlamado: number;
  nombreTipoLlamado: string;
}

export default function ParteAsistencia() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [allPartes, setAllPartes] = useState<ParteAsistencia[]>([]);
  const [filteredPartes, setFilteredPartes] = useState<ParteAsistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoLlamado, setTipoLlamado] = useState<TipoCitacion[]>([]);

  useEffect(() => {
    fetchAllPartes();
    fetchTipoLlamado();
  }, []);

  const fetchAllPartes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch partes de asistencia data");
      }
      const data = await response.json();
      setAllPartes(data);
      setFilteredPartes(data);
    } catch (err) {
      setError("Error fetching partes de asistencia data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipoLlamado = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tipo llamado data");
      }
      const data = await response.json();
      setTipoLlamado(data);
    } catch (error) {
      console.error("Error fetching tipo llamado:", error);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filtered = allPartes.filter(
      (parte) =>
        parte.aCargoDelCuerpo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parte.aCargoDeLaCompania.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parte.folioPAsistencia.toString().includes(searchTerm)
    );
    setFilteredPartes(filtered);
  };

  const handleCrearParte = () => {
    router.push("/parte-asistencia/crear");
  };

  const handleDeleteParte = async (folio: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/eliminar/${folio}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete parte de asistencia');
      }
      setAllPartes(prev => prev.filter(p => p.folioPAsistencia !== folio));
      setFilteredPartes(prev => prev.filter(p => p.folioPAsistencia !== folio));
      toast({
        title: "Éxito",
        description: "Parte de asistencia eliminado correctamente.",
      });
    } catch (error) {
      console.error('Error deleting parte de asistencia:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el parte de asistencia. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-7xl mx-auto mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Partes de Asistencia</CardTitle>
          <Button onClick={handleCrearParte}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Parte de Asistencia
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por folio, a cargo del cuerpo o compañía"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {loading ? (
            <p className="text-center">Cargando datos de partes de asistencia...</p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableCaption>Lista de partes de asistencia</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Tipo de Llamado</TableHead>
                    <TableHead>A Cargo del Cuerpo</TableHead>
                    <TableHead>A Cargo de la Compañía</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fin</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Total Asistencia</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartes.map((parte) => (
                    <TableRow key={parte.folioPAsistencia}>
                      <TableCell>{parte.folioPAsistencia}</TableCell>
                      <TableCell>
                        {tipoLlamado.find(llamado => llamado.idTipoLlamado === parte.idTipoLlamado)?.nombreTipoLlamado || 'N/A'}
                      </TableCell>
                      <TableCell>{parte.aCargoDelCuerpo}</TableCell>
                      <TableCell>{parte.aCargoDeLaCompania}</TableCell>
                      <TableCell>{parte.fechaAsistencia}</TableCell>
                      <TableCell>{parte.horaInicio}</TableCell>
                      <TableCell>{parte.horaFin}</TableCell>
                      <TableCell>{parte.direccionAsistencia}</TableCell>
                      <TableCell>{parte.totalAsistencia}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/parte-asistencia/editar/${parte.folioPAsistencia}`} passHref>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Eliminar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el parte de asistencia con folio {parte.folioPAsistencia}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteParte(parte.folioPAsistencia)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}