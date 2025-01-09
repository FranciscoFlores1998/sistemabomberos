"use client";

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
import { Search, UserPlus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface VoluntarioData {
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
  idCargo: string;
  rutVoluntario: string;
  idCompania: string;
  idUsuario: number | null;
  apellidop: string;
  apellidom: string;
}

interface CargoData {
  idCargo: number;
  nombreCarg: string;
}

interface CompaniaData {
  idCompania: number;
  nombreCia: string;
}

type SortColumn = "apellidop" | "claveRadial";

export default function Busqueda() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [allVoluntarios, setAllVoluntarios] = useState<VoluntarioData[]>([]);
  const [filteredVoluntarios, setFilteredVoluntarios] = useState<
    VoluntarioData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [cargoVol, setCargoVol] = useState<CargoData[]>([]);
  const [companiaVol, setCompaniaVol] = useState<CompaniaData[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<SortColumn>("apellidop");

  useEffect(() => {
    fetchAllVoluntarios();
    fetchCargos();
    fetchCompanias();
  }, []);

  const fetchCargos = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cargo/obtener`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cargos data");
      }
      const data = await response.json();
      setCargoVol(data);
    } catch (error) {
      console.error("Error fetching cargos:", error);
    }
  };

  const fetchCompanias = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/compania/obtener`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch compañias data");
      }
      const data = await response.json();
      setCompaniaVol(data);
    } catch (error) {
      console.error("Error fetching compañias:", error);
    }
  };

  const fetchAllVoluntarios = async () => {
    setLoading(true);

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
        throw new Error("Failed to fetch volunteers data");
      }
      const data: VoluntarioData[] = await response.json();
      const sortedData = sortVoluntarios(data, "apellidop", "asc");
      setAllVoluntarios(sortedData);
      setFilteredVoluntarios(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortVoluntarios = (
    voluntarios: VoluntarioData[],
    column: SortColumn,
    order: "asc" | "desc"
  ): VoluntarioData[] => {
    return [...voluntarios].sort((a, b) => {
      if (order === "asc") {
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filtered = allVoluntarios.filter(
      (voluntario) =>
        voluntario.nombreVol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voluntario.apellidop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voluntario.apellidom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voluntario.rutVoluntario
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        voluntario.claveRadial
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        voluntario.numeroContacto
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredVoluntarios(filtered);
  };

  const handleCreateVolunteer = () => {
    router.push("/voluntario/crear");
  };

  const handleDeleteVolunteer = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/eliminar/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        const message = JSON.parse(await response.text());
        console.log(message);
        toast.error(message.error);
        throw new Error("Failed to delete volunteer");
      }
      toast.success("Voluntario eliminado exitosamente");
      setAllVoluntarios((prev) => prev.filter((v) => v.idVoluntario !== id));
      setFilteredVoluntarios((prev) =>
        prev.filter((v) => v.idVoluntario !== id)
      );
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  const toggleSorting = (column: SortColumn) => {
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(column);
    const sorted = sortVoluntarios(filteredVoluntarios, column, newSortOrder);
    setFilteredVoluntarios(sorted);
  };

  useEffect(() => {
    if (cargoVol.length > 0 && companiaVol.length > 0) {
      setFilteredVoluntarios((prevFiltered) => [...prevFiltered]);
    }
  }, [cargoVol, companiaVol]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mx-auto mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Voluntarios</CardTitle>
          <Button onClick={handleCreateVolunteer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Crear Voluntario
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
                placeholder="Buscar por nombre, apellidos, RUT o clave radial"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {loading ? (
            <p className="text-center">Cargando datos de voluntarios...</p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableCaption>Lista de voluntarios</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSorting("claveRadial")}
                        className="hover:bg-transparent"
                      >
                        Clave Radial
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSorting("apellidop")}
                        className="hover:bg-transparent"
                      >
                        Paterno
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Materno</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RUT</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Compañía</TableHead>
                    <TableHead>N° Contacto</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Fecha de Ingreso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVoluntarios.map((voluntario) => (
                    <TableRow key={voluntario.idVoluntario}>
                      <TableCell
                        className="pl-10"
                      >{voluntario.claveRadial}</TableCell>
                      <TableCell>{voluntario.apellidop}</TableCell>
                      <TableCell>{voluntario.apellidom}</TableCell>
                      <TableCell>{voluntario.nombreVol}</TableCell>
                      <TableCell>{voluntario.rutVoluntario}</TableCell>
                      <TableCell>
                        {cargoVol.find(
                          (cargo) =>
                            cargo.idCargo === parseInt(voluntario.idCargo)
                        )?.nombreCarg || "N/A"}
                      </TableCell>
                      <TableCell>
                        {companiaVol.find(
                          (compania) =>
                            compania.idCompania ===
                            parseInt(voluntario.idCompania)
                        )?.nombreCia || "N/A"}
                      </TableCell>
                      <TableCell>{voluntario.numeroContacto}</TableCell>
                      <TableCell>{voluntario.direccion}</TableCell>
                      <TableCell>{voluntario.fechaIngreso}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link
                            href={`/voluntario/editar/${voluntario.idVoluntario}`}
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
                                  Esta acción no se puede deshacer. Esto
                                  eliminará permanentemente al voluntario{" "}
                                  {voluntario.nombreVol}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteVolunteer(
                                      voluntario.idVoluntario
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
