"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { CrearUsuarioModal } from "../../components/CrearUsuarioModal";

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  rutVoluntario: string;
}

export default function ListaVoluntarios() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los voluntarios");
        }

        const data = await response.json();
        setVoluntarios(data);
      } catch (error) {
        console.error("Error fetching voluntarios:", error);
        toast.error("Error al cargar los voluntarios. Por favor, intente de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchVoluntarios();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-right" />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Voluntarios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando voluntarios...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Voluntario</TableHead>
                  <TableHead>Nombre Voluntario</TableHead>
                  <TableHead>RUT Voluntario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voluntarios.map((voluntario) => (
                  <TableRow key={voluntario.idVoluntario}>
                    <TableCell>{voluntario.idVoluntario}</TableCell>
                    <TableCell>{voluntario.nombreVol}</TableCell>
                    <TableCell>{voluntario.rutVoluntario}</TableCell>
                    <TableCell>
                      <CrearUsuarioModal idVoluntario={voluntario.idVoluntario} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

