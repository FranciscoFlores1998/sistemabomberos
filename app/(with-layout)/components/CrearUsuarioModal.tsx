"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

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

export function CrearUsuarioModal({ idVoluntario }: { idVoluntario: number }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [voluntario, setVoluntario] = useState<VoluntarioData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const buscarVoluntario = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/buscar/${idVoluntario}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!response.ok) {
          throw new Error("Error al buscar el voluntario");
        }
        const data: VoluntarioData = await response.json();
        setVoluntario(data);
      } catch (error) {
        console.error("Error fetching volunteer:", error);
        toast.error("Error al buscar el voluntario. Por favor, intente de nuevo.");
      }
    };

    if (open) {
      buscarVoluntario();
    }
  }, [idVoluntario, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ nombreUsuario, contrasena }),
      });

      if (!userResponse.ok) {
        throw new Error("Error al crear el usuario");
      }

      const userData = await userResponse.json();
      const idUsuario = userData.idUsuario;

      if (!voluntario) {
        throw new Error("No se encontró información del voluntario");
      }

      // Update volunteer with all existing information plus the new idUsuario
      const updatedVoluntarioData = {
        ...voluntario,
        idUsuario: idUsuario
      };

      const voluntarioResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/actualizar/${idVoluntario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(updatedVoluntarioData),
      });

      if (!voluntarioResponse.ok) {
        throw new Error("Error al actualizar el voluntario");
      }

      toast.success("Usuario creado y voluntario actualizado exitosamente");
      router.refresh();
      setNombreUsuario("");
      setContrasena("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating user or updating volunteer:", error);
      toast.error("Error al crear el usuario o actualizar el voluntario. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Crear Usuario para Voluntario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario para {voluntario ? voluntario.nombreVol : 'Voluntario'}</DialogTitle>
        </DialogHeader>
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
            <Label htmlFor="contrasena">Contraseña</Label>
            <Input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Crear Usuario"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

