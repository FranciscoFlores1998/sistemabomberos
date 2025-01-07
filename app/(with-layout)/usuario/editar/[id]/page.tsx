"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";

interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  contrasena: string;
}

export default function EditarUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    
    const fetchData = () => {
      Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/buscar/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
      ])
      .then(([usuarioRes]) => {
        if (!usuarioRes.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        return Promise.all([usuarioRes.json()]);
      })
      .then(([usuarioData]) => {
        setUsuario(usuarioData);
        setNombreUsuario(usuarioData.nombreUsuario);
      })
      .catch(error => {
        toast.error("Error al cargar los datos del usuario. Por favor, intente de nuevo.");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      nombreUsuario,
      ...(contrasena && { contrasena })
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/actualizar/${usuario?.idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(updateData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al actualizar el usuario");
        }
        return response.json();
      })
      .then(() => {
        toast.success("Usuario actualizado exitosamente");
        router.push("/usuario");
        router.refresh();
      })
      .catch(error => {
        toast.error("Error al actualizar el usuario. Por favor, intente de nuevo.");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div className="container mx-auto py-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-right" />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Editar Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreUsuario">Nombre de Usuario</Label>
              <Input
                id="nombreUsuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrasena">Nueva Contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Usuario"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

