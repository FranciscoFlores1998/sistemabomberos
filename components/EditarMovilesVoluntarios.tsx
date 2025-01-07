import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Trash2, Search } from 'lucide-react';

interface Movil {
  idMovil: number;
  nomenclatura: string;
  especialidad: string;
}

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  claveRadial: string;
}

interface Props {
  folioPAsistencia: number;
}

export function EditarMovilesVoluntarios({ folioPAsistencia }: Props) {
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [addedMoviles, setAddedMoviles] = useState<Movil[]>([]);
  const [addedVoluntarios, setAddedVoluntarios] = useState<Voluntario[]>([]);
  const [selectedMovil, setSelectedMovil] = useState<string>("");
  const [selectedVoluntario, setSelectedVoluntario] = useState<string>("");
  const [movilFilter, setMovilFilter] = useState<string>("");
  const [voluntarioFilter, setVoluntarioFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseMoviles, responseVoluntarios, responseParteMoviles, responseParteVoluntarios] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/movil/obtener`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-movil/obtener/${folioPAsistencia}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-voluntario/obtener/${folioPAsistencia}`)
        ]);

        if (responseMoviles.ok && responseVoluntarios.ok && responseParteMoviles.ok && responseParteVoluntarios.ok) {
          const [dataMoviles, dataVoluntarios, dataParteMoviles, dataParteVoluntarios] = await Promise.all([
            responseMoviles.json(),
            responseVoluntarios.json(),
            responseParteMoviles.json(),
            responseParteVoluntarios.json()
          ]);

          setMoviles(dataMoviles);
          setVoluntarios(dataVoluntarios);
          setAddedMoviles(dataParteMoviles);
          setAddedVoluntarios(dataParteVoluntarios);
        } else {
          toast.error("Hubo un error al obtener los datos.");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Hubo un error al conectar con el servidor.");
      }
    };

    fetchData();
  }, [folioPAsistencia]);

  const filteredMoviles = useMemo(() => {
    return moviles.filter(movil => 
      !addedMoviles.some(added => added.idMovil === movil.idMovil) &&
      (movil.nomenclatura.toLowerCase().includes(movilFilter.toLowerCase()) ||
       movil.especialidad.toLowerCase().includes(movilFilter.toLowerCase()))
    );
  }, [moviles, addedMoviles, movilFilter]);

  const filteredVoluntarios = useMemo(() => {
    return voluntarios.filter(voluntario => 
      !addedVoluntarios.some(added => added.idVoluntario === voluntario.idVoluntario) &&
      (voluntario.nombreVol.toLowerCase().includes(voluntarioFilter.toLowerCase()) ||
       voluntario.claveRadial.toLowerCase().includes(voluntarioFilter.toLowerCase()))
    );
  }, [voluntarios, addedVoluntarios, voluntarioFilter]);

  const handleAddMovil = async () => {
    if (!selectedMovil) return;

    const movilToAdd = moviles.find(m => m.idMovil.toString() === selectedMovil);
    if (!movilToAdd) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-movil/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          folioPAsistencia: folioPAsistencia,
          idMovil: movilToAdd.idMovil,
        }),
      });

      if (response.ok) {
        setAddedMoviles([...addedMoviles, movilToAdd]);
        setSelectedMovil("");
        toast.success("Móvil agregado correctamente");
      } else {
        toast.error("Error al agregar el móvil");
      }
    } catch (error) {
      console.error("Error al agregar móvil:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  const handleRemoveMovil = async (movilId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-movil/eliminar/${folioPAsistencia}/${movilId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        setAddedMoviles(addedMoviles.filter(m => m.idMovil !== movilId));
        toast.success("Móvil eliminado correctamente");
      } else {
        toast.error("Error al eliminar el móvil");
      }
    } catch (error) {
      console.error("Error al eliminar móvil:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  const handleAddVoluntario = async () => {
    if (!selectedVoluntario) return;

    const voluntarioToAdd = voluntarios.find(v => v.idVoluntario.toString() === selectedVoluntario);
    if (!voluntarioToAdd) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-voluntario/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          folioPAsistencia: folioPAsistencia,
          idVoluntario: voluntarioToAdd.idVoluntario,
        }),
      });

      if (response.ok) {
        setAddedVoluntarios([...addedVoluntarios, voluntarioToAdd]);
        setSelectedVoluntario("");
        toast.success("Voluntario agregado correctamente");
      } else {
        toast.error("Error al agregar el voluntario");
      }
    } catch (error) {
      console.error("Error al agregar voluntario:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  const handleRemoveVoluntario = async (voluntarioId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-voluntario/eliminar/${folioPAsistencia}/${voluntarioId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        setAddedVoluntarios(addedVoluntarios.filter(v => v.idVoluntario !== voluntarioId));
        toast.success("Voluntario eliminado correctamente");
      } else {
        toast.error("Error al eliminar el voluntario");
      }
    } catch (error) {
      console.error("Error al eliminar voluntario:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Editar Móviles del Parte de Asistencia</h3>
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar móvil..."
              value={movilFilter}
              onChange={(e) => setMovilFilter(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Select value={selectedMovil} onValueChange={setSelectedMovil}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccione un Móvil" />
            </SelectTrigger>
            <SelectContent>
              {filteredMoviles.map((movil) => (
                <SelectItem key={movil.idMovil} value={movil.idMovil.toString()}>
                  {movil.nomenclatura} - {movil.especialidad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddMovil}>Agregar Móvil</Button>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Móviles Agregados:</h4>
          <ul className="space-y-2">
            {addedMoviles.map((movil) => (
              <li key={movil.idMovil} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{movil.nomenclatura} - {movil.especialidad}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveMovil(movil.idMovil)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Editar Voluntarios del Parte de Asistencia</h3>
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar voluntario..."
              value={voluntarioFilter}
              onChange={(e) => setVoluntarioFilter(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Select value={selectedVoluntario} onValueChange={setSelectedVoluntario}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccione un Voluntario" />
            </SelectTrigger>
            <SelectContent>
              {filteredVoluntarios.map((voluntario) => (
                <SelectItem key={voluntario.idVoluntario} value={voluntario.idVoluntario.toString()}>
                  {voluntario.claveRadial} - {voluntario.nombreVol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddVoluntario}>Agregar Voluntario</Button>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Voluntarios Agregados:</h4>
          <ul className="space-y-2">
            {addedVoluntarios.map((voluntario) => (
              <li key={voluntario.idVoluntario} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{voluntario.claveRadial} - {voluntario.nombreVol}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveVoluntario(voluntario.idVoluntario)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

