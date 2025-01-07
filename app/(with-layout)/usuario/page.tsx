"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useRouter } from "next/navigation";
import { UserPlus } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
}

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  idUsuario: number | null;
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsuariosYVoluntarios();
  }, []);

  const fetchUsuariosYVoluntarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usuariosResponse, voluntariosResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
      ]);

      if (!usuariosResponse.ok || !voluntariosResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const usuariosData = await usuariosResponse.json();
      const voluntariosData = await voluntariosResponse.json();

      setUsuarios(usuariosData);
      setVoluntarios(voluntariosData);
    } catch (err) {
      setError("Error al obtener los datos. Por favor, intente de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    router.push('/usuario/crear');
  };

  const handleEdit = (id: number) => {
    console.log(`Editando usuario con ID: ${id}`);
    router.push(`/usuario/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      // Find the volunteer associated with this user
      const voluntarioAsociado = voluntarios.find(v => v.idUsuario === id);

      if (!voluntarioAsociado) {
        throw new Error('No se encontró un voluntario asociado a este usuario');
      }
      // Then, update the associated volunteer
      const updateVolunteerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/actualizar/${voluntarioAsociado.idVoluntario}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ ...voluntarioAsociado, idUsuario: null }),
      });
      if (!updateVolunteerResponse.ok) {
        throw new Error('Failed to update volunteer');
      }

      setUsuarios(usuarios.filter(usuario => usuario.idUsuario !== id));
      setVoluntarios(voluntarios.map(v => 
        v.idVoluntario === voluntarioAsociado.idVoluntario ? { ...v, idUsuario: null } : v
      ));
      toast.success("Usuario eliminado y voluntario actualizado exitosamente");
      // First, delete the user
      const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete user');
      }


    } catch (error) {
      console.error('Error deleting user or updating volunteer:', error);
      toast.error('Error al eliminar el usuario o actualizar el voluntario. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-right" />
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Usuarios</CardTitle>
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Crear Usuario
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {loading ? (
            <p className="text-center">Cargando datos de usuarios...</p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableCaption>Lista de usuarios del sistema</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Usuario</TableHead>
                    <TableHead>Nombre de Usuario</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.idUsuario}>
                      <TableCell>{usuario.idUsuario}</TableCell>
                      <TableCell>{usuario.nombreUsuario}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(usuario.idUsuario)}>
                            Editar
                          </Button>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario {usuario.nombreUsuario}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(usuario.idUsuario)}>
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

