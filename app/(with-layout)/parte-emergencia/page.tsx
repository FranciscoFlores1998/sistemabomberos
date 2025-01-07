"use client";

import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";

interface ParteEmergencia {
  folioPEmergencia: number;
  horaInicio: string;
  horaFin: string;
  fechaEmergencia: string;
  preInforme: string;
  llamarEmpresaQuimica: boolean | null;
  descripcionMaterialP: string;
  folioPAsistencia: number | null;
  direccionEmergencia: string;
  idOficial: number;
  idClaveEmergencia: number;
  nombreClaveEmergencia?: string;
}

export default function ParteEmergencia() {
  const [parteEmergenciaOptions, setParteEmergenciaOptions] = useState<
    ParteEmergencia[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    obtenerParteEmergencia();
  }, []);

  const obtenerParteEmergencia = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/obtener`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.ok) {
        const data: ParteEmergencia[] = await response.json();

        // Fetch the name for each emergency key
        const partesConNombres = await Promise.all(
          data.map(async (parte) => {
            const nombreClave = await obtenerNombreClaveEmergencia(
              parte.idClaveEmergencia
            );
            return { ...parte, nombreClaveEmergencia: nombreClave };
          })
        );

        setParteEmergenciaOptions(partesConNombres);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Hubo un error al obtener el parte de emergencia."
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un error al obtener el parte de emergencia.",
        variant: "destructive",
      });
    }
  };

  const obtenerNombreClaveEmergencia = async (id: number): Promise<string> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/buscar/${id}`,
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
        return data.nombreClaveEmergencia;
      } else {
        throw new Error(
          "No se pudo obtener el nombre de la clave de emergencia"
        );
      }
    } catch (error) {
      console.error(
        "Error al obtener el nombre de la clave de emergencia:",
        error
      );
      return "Desconocido";
    }
  };

  const handleCrearParte = () => {
    router.push("/parte-emergencia/crear");
  };

  const handleDeleteParteEmergencia = async (folio: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/eliminar/${folio}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete parte de emergencia");
      }
      setParteEmergenciaOptions((prev) =>
        prev.filter((p) => p.folioPEmergencia !== folio)
      );
      toast({
        title: "Éxito",
        description: "Parte de emergencia eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting parte de emergencia:", error);
      toast({
        title: "Error",
        description:
          "Error al eliminar el parte de emergencia. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
        <Card className="w-full max-w-7xl mx-auto mb-6">
          <CardHeader className=" flex flex-row items-center justify-between">
            <CardTitle>Gestión de Partes de Asistencia</CardTitle>
            <Button
              onClick={handleCrearParte}
            ><Plus className="mr-2 h-4 w-4" />
              Crear Parte
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Lista de partes de emergencia</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Hora Inicio</TableHead>
                  <TableHead>Hora Fin</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Pre-Informe</TableHead>
                  <TableHead>Llamar Empresa Química</TableHead>
                  <TableHead>Descripción Material Peligroso</TableHead>
                  <TableHead>Folio P. Asistencia</TableHead>
                  <TableHead>Dirección Emergencia</TableHead>
                  <TableHead>ID Oficial</TableHead>
                  <TableHead>Clave Emergencia</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parteEmergenciaOptions.map((parte) => (
                  <TableRow key={parte.folioPEmergencia}>
                    <TableCell>{parte.folioPEmergencia}</TableCell>
                    <TableCell>{parte.horaInicio}</TableCell>
                    <TableCell>{parte.horaFin}</TableCell>
                    <TableCell>{parte.fechaEmergencia}</TableCell>
                    <TableCell>{parte.preInforme}</TableCell>
                    <TableCell>
                      {parte.llamarEmpresaQuimica === null
                        ? "N/A"
                        : parte.llamarEmpresaQuimica
                        ? "Sí"
                        : "No"}
                    </TableCell>
                    <TableCell>{parte.descripcionMaterialP}</TableCell>
                    <TableCell>{parte.folioPAsistencia || "N/A"}</TableCell>
                    <TableCell>{parte.direccionEmergencia}</TableCell>
                    <TableCell>{parte.idOficial}</TableCell>
                    <TableCell>
                      {parte.nombreClaveEmergencia || "Desconocido"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link
                          href={`/parte-emergencia/ver/${parte.folioPEmergencia}`}
                          passHref
                        >
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </Link>
                        <Link
                          href={`/parte-emergencia/editar/${parte.folioPEmergencia}`}
                          passHref
                        >
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
                              <AlertDialogTitle>
                                ¿Estás seguro?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará
                                permanentemente el parte de emergencia con folio{" "}
                                {parte.folioPEmergencia}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteParteEmergencia(
                                    parte.folioPEmergencia
                                  )
                                }
                              >
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
          </CardContent>
        </Card>
    </div>
  );
}
