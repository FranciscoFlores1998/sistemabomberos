"use client";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
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
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
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
interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
}
interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}
type SortColumn = "folioPEmergencia" | "fechaEmergencia" | "idClaveEmergencia";
export default function ParteEmergencia() {
  const user = Cookies.get("login");
  const parseUSer = JSON.parse(user);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [allPartes, setAllPartes] = useState<ParteEmergencia[]>([]);
  const [filteredPartes, setFilteredPartes] = useState<ParteEmergencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [claveEmergencia, setClavesEmergencia] = useState<ClaveEmergencia[]>(
    []
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<SortColumn>("folioPEmergencia");
  useEffect(() => {
    fetchAllPartes();
    fetchClaveEmergencia();
    fetchVoluntario();
  }, []);

  const fetchAllPartes = async () => {
    setLoading(true);
    setError(null);
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
      if (!response.ok) {
        throw new Error("Failed to fetch partes de emergencia data");
      }
      const data = await response.json();
      setAllPartes(data);
      setFilteredPartes(data);
    } catch (err) {
      setError("Error fetching partes de emergencia data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };
  const fetchClaveEmergencia = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tipo llamado data");
      }
      const data = await response.json();
      setClavesEmergencia(data);
    } catch (error) {
      console.error("Error fetching tipo llamado:", error);
    }
  };

  const fetchVoluntario = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch voluntarios");
      }
      const data = await response.json();
      setVoluntarios(data);
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filtered = allPartes.filter((parte) => {
      const claveEmergencia = claveEmergencia
        .find((tipo) => tipo.nombreClave === parte.nombreClave)
        ?.nombreTipoLlamado.toLowerCase();
      return (
        // parte.aCargoDelCuerpo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // parte.aCargoDeLaCompania.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parte.folioPEmergencia.toString().includes(searchTerm) ||
        (claveEmergencia && claveEmergencia.includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredPartes(filtered);
  };
  const toggleSorting = (column: SortColumn) => {
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(column);
    const sorted = [...filteredPartes].sort((a, b) => {
      if (column === "folioPEmergencia") {
        return newSortOrder === "asc"
          ? a.folioPEmergencia - b.folioPEmergencia
          : b.folioPEmergencia - a.folioPEmergencia;
      } else if (column === "fechaEmergencia") {
        return newSortOrder === "asc"
          ? new Date(a.fechaEmergencia).getTime() -
              new Date(b.fechaEmergencia).getTime()
          : new Date(b.fechaEmergencia).getTime() -
              new Date(a.fechaEmergencia).getTime();
      } else {
        // For idClaveEmergencia
        return newSortOrder === "asc"
          ? a.idClaveEmergencia - b.idClaveEmergencia
          : b.idClaveEmergencia - a.idClaveEmergencia;
      }
    });
    setFilteredPartes(sorted);
  };
  const handleCrearParte = () => {
    router.push("/parte-emergencia/crear");
  };

  const handleDeleteParte = async (folio: number) => {
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
      setAllPartes((prev) => prev.filter((p) => p.folioPEmergencia !== folio));
      setFilteredPartes((prev) =>
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
      <Card className="w-full max-w-8xl mx-auto mb-6">
        <CardHeader className=" flex flex-row items-center justify-between">
          <CardTitle>Gestión de Partes de Emergencia</CardTitle>
          <Button onClick={handleCrearParte}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Parte de Emergencia
          </Button>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className="flex items-center space-x-2 mb-6"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por folio o clave de emergencia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {loading ? (
            <p className="text-center">
              Cargando datos de partes de asistencia...
            </p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableCaption>Lista de partes de emergencia</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSorting("folioPEmergencia")}
                        className="hover:bg-transparent"
                      >
                        Folio
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSorting("idClaveEmergencia")}
                        className="hover:bg-transparent"
                      >
                        Clave Emergencia
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSorting("fechaEmergencia")}
                        className="hover:bg-transparent"
                      >
                        Fecha
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Dirección Emergencia</TableHead>
                    <TableHead>Oficial</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fin</TableHead>
                    <TableHead>Folio P. Asistencia</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartes.map((parte) => (
                    <TableRow key={parte.folioPEmergencia}>
                      <TableCell>{parte.folioPEmergencia}</TableCell>
                      <TableCell>
                        {
                          claveEmergencia.find(
                            (oCuerpo) =>
                              oCuerpo.idClaveEmergencia ===
                              parseInt(parte.idClaveEmergencia.toString())
                          )?.nombreClaveEmergencia
                        }
                      </TableCell>
                      <TableCell>{formatDate(parte.fechaEmergencia)}</TableCell>
                      <TableCell>{parte.direccionEmergencia}</TableCell>
                      <TableCell>
                        {
                          voluntarios.find(
                            (oCuerpo) =>
                              oCuerpo.idVoluntario ===
                              parseInt(parte.idOficial.toString())
                          )?.nombreVol
                        }
                      </TableCell>
                      <TableCell>{parte.horaInicio}</TableCell>
                      <TableCell>{parte.horaFin}</TableCell>
                      <TableCell>{parte.folioPAsistencia || "N/A"}</TableCell>
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
                          {parseUSer.cargo.idCargo === 1 && (
                            <Link
                              href={`/parte-emergencia/editar/${parte.folioPEmergencia}`}
                              passHref
                            >
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </Link>
                          )}
                          <AlertDialog>
                            {parseUSer.cargo.idCargo === 1 && (
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                            )}
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Estás seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto
                                  eliminará permanentemente el parte de
                                  emergencia con folio {parte.folioPEmergencia}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteParte(parte.folioPEmergencia)
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
