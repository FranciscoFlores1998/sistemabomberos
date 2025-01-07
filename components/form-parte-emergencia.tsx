"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import { formatearFecha } from "@/lib/formatearFecha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import toast, { Toaster } from "react-hot-toast";

interface MaterialPeligroso {
  idMaterialP: number;
  clasificacion: string;
}

interface Voluntario {
  idVoluntario: number;
  nombreVol: string;
  claveRadial: string;
}

interface ClaveEmergencia {
  idClaveEmergencia: number;
  nombreClaveEmergencia: string;
}

interface ParteAsistencia {
  folioPAsistencia: number;
  observaciones: string;
}

interface Movil {
  idMovil: number;
  nomenclatura: string;
  especialidad: string;
}

interface FormData {
  folioPEmergencia: number | null;
  horaInicio: string;
  horaFin: string;
  fechaEmergencia: string;
  preInforme: string;
  llamarEmpresaQuimica: boolean;
  descripcionMaterialP: string;
  direccionEmergencia: string;
  idOficial: string;
  idClaveEmergencia: string;
  folioPAsistencia: string | null;
  idMaterialP: string | null;
  isDescripcionDisabled: boolean;
}

interface Victima {
  idVictima?: number;
  rutVictima: string;
  nombreVictima: string;
  edadVictima: number;
  descripcion: string;
  folioPEmergencia: number;
}

interface Institucion {
  idInstitucion?: number;
  nombreInstitucion: string;
  tipoInstitucion: string;
  nombrePersonaCargo: string;
  horaLlegada: string;
  folioPEmergencia: number | null;
}

interface Inmueble {
  idInmueble?: number;
  direccion: string;
  tipoInmueble: string;
  estadoInmueble: string;
  folioPEmergencia: number | null;
}

interface Vehiculo {
  idVehiculo?: number;
  patente: string;
  marca: string;
  modelo: string;
  tipoVehiculo: string;
  folioPEmergencia: number | null;
}

export default function FormParteEmergencia({
  params,
}: {
  params?: { folio: string };
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [parteAsistenciaOptions, setParteAsistenciaOptions] = useState<
    ParteAsistencia[]
  >([]);
  const [materialesPeligrosos, setMaterialesPeligrosos] = useState<
    MaterialPeligroso[]
  >([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [voluntariosDisponibles, setVoluntariosDisponibles] = useState<
    Voluntario[]
  >([]);
  const [parteEmergenciaCompleto, setParteEmergenciaCompleto] =
    useState<boolean>(false);
  const [claveemergencia, setClaveEmergencia] = useState<ClaveEmergencia[]>([]);
  const [idParteEmergencia, setIdParteEmergencia] = useState<string | null>(
    params?.folio ?? null
  );
  const [formData, setFormData] = useState<FormData>({
    folioPEmergencia: null,
    horaInicio: "",
    horaFin: "",
    fechaEmergencia: "",
    preInforme: "",
    llamarEmpresaQuimica: false,
    descripcionMaterialP: "",
    direccionEmergencia: "",
    idOficial: "",
    idClaveEmergencia: "",
    folioPAsistencia: null,
    idMaterialP: null,
    isDescripcionDisabled: true,
  });
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [movilesDisponibles, setMovilesDisponibles] = useState<Movil[]>([]);
  const [selectedMovil, setSelectedMovil] = useState<string>("");
  const [addedMoviles, setAddedMoviles] = useState<Movil[]>([]);
  const [selectedVoluntario, setSelectedVoluntario] = useState<string>("");
  const [addedVoluntarios, setAddedVoluntarios] = useState<Voluntario[]>([]);
  const [victima, setVictima] = useState<Victima>({
    rutVictima: "",
    nombreVictima: "",
    edadVictima: 0,
    descripcion: "",
    folioPEmergencia: 0,
  });
  const [institucion, setInstitucion] = useState<Institucion>({
    nombreInstitucion: "",
    tipoInstitucion: "",
    nombrePersonaCargo: "",
    horaLlegada: "",
    folioPEmergencia: null,
  });
  const [inmueble, setInmueble] = useState<Inmueble>({
    direccion: "",
    tipoInmueble: "",
    estadoInmueble: "",
    folioPEmergencia: null,
  });
  const [vehiculo, setVehiculo] = useState<Vehiculo>({
    patente: "",
    marca: "",
    modelo: "",
    tipoVehiculo: "",
    folioPEmergencia: null,
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | string
      | boolean,
    name?: string
  ) => {
    if (typeof e === "boolean" && name) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e,
      }));
    } else if (typeof e === "string" && name) {
      if (name === "idMaterialP") {
        const isNoneSelected = e === "null";
        setFormData((prevState) => ({
          ...prevState,
          [name]: isNoneSelected ? null : e,
          isDescripcionDisabled: isNoneSelected,
          descripcionMaterialP: isNoneSelected
            ? ""
            : prevState.descripcionMaterialP,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: e === "null" ? null : e,
        }));
      }
    } else if (e && typeof e === "object" && "target" in e) {
      const { name, value } = e.target as HTMLInputElement;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "horaInicio",
      "horaFin",
      "preInforme",
      "direccionEmergencia",
      "idOficial",
      "idClaveEmergencia",
    ];
    let hasError = false;

    requiredFields.forEach((field) => {
      const element = document.getElementById(field);
      if (!formData[field as keyof FormData]) {
        element?.classList.add("border-red-500");
        hasError = true;
      } else {
        element?.classList.remove("border-red-500");
      }
    });

    if (hasError) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }
    const envioParteEmergencia = {
      ...(idParteEmergencia && { folioPEmergencia: idParteEmergencia }),
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      fechaEmergencia: formatearFecha(date.toISOString()),
      preInforme: formData.preInforme,
      llamarEmpresaQuimica: formData.llamarEmpresaQuimica,
      descripcionMaterialP: formData.descripcionMaterialP,
      direccionEmergencia: formData.direccionEmergencia,
      idOficial: formData.idOficial,
      idClaveEmergencia: formData.idClaveEmergencia,
      folioPAsistencia: formData.folioPAsistencia || null,
    };
    console.log("Datos del formulario:", formData);

    console.log("Datos del formulario con fecha:", formData);
    try {
      const response = await fetch("/api/parte-emergencia/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(envioParteEmergencia),
      });
      console.log("Respuesta del servidor:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        toast.success("Parte de emergencia guardado");
        setIdParteEmergencia(data.folioPEmergencia);
        setParteEmergenciaCompleto(true);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Hubo un error al crear el parte de emergencia."
        );
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el parte de emergencia.");
    }
  };

  const fetchMoviles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movil/obtener`, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMoviles(data);
        setMovilesDisponibles(data);
      } else {
        throw new Error("Failed to fetch moviles");
      }
    } catch (error) {
      console.error("Error fetching moviles:", error);
      toast.error("Error al cargar los móviles.");
    }
  };

  const fetchMovilesSeleccionados = async () => {
    if (!params?.folio) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia-movil/obtener-moviles-emergencia/${params.folio}`, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Moviles seleccionados:", data);
        setAddedMoviles(data);
        // Actualizar móviles disponibles
        setMovilesDisponibles(prevMoviles => 
          prevMoviles.filter(movil => 
            !data.some(addedMovil => addedMovil.idMovil === movil.idMovil)
          )
        );
      } else {
        throw new Error("Failed to fetch moviles seleccionados");
      }
    } catch (error) {
      console.error("Error fetching moviles seleccionados:", error);
      toast.error("Error al cargar los móviles seleccionados.");
    }
  };

  const fetchVoluntarios = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVoluntarios(data);
        setVoluntariosDisponibles(data);
      } else {
        throw new Error("Failed to fetch voluntarios");
      }
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
      toast.error("Error al cargar los voluntarios.");
    }
  };

  const handleAddMovil = async () => {
    if (!selectedMovil) return;

    const movilToAdd = movilesDisponibles.find(
      (m) => m.idMovil.toString() === selectedMovil
    );
    if (!movilToAdd) return;

    // Verificar si el móvil ya está agregado
    if (addedMoviles.some((m) => m.idMovil === movilToAdd.idMovil)) {
      toast.error("Este móvil ya está agregado al parte de emergencia");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia-movil/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            folioPEmergencia: idParteEmergencia,
            idMovil: movilToAdd.idMovil,
          }),
        }
      );

      if (response.ok) {
        setAddedMoviles([...addedMoviles, movilToAdd]);
        setMovilesDisponibles(
          movilesDisponibles.filter((m) => m.idMovil !== movilToAdd.idMovil)
        );
        setSelectedMovil("");
        toast.success("Móvil agregado correctamente");
      } else {
        throw new Error("Failed to add movil");
      }
    } catch (error) {
      console.error("Error adding movil:", error);
      toast.error("Error al agregar el móvil.");
    }
  };

  const handleAddVoluntario = async () => {
    if (!selectedVoluntario) return;

    const voluntarioToAdd = voluntariosDisponibles.find(
      (v) => v.idVoluntario.toString() === selectedVoluntario
    );
    if (!voluntarioToAdd) return;

    // Verificar si el voluntario ya está agregado
    if (addedVoluntarios.some((v) => v.idVoluntario === voluntarioToAdd.idVoluntario)) {
      toast.error("Este voluntario ya está agregado al parte de emergencia");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia-voluntario/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            folioPEmergencia: idParteEmergencia,
            idVoluntario: voluntarioToAdd.idVoluntario,
          }),
        }
      );

      if (response.ok) {
        setAddedVoluntarios([...addedVoluntarios, voluntarioToAdd]);
        setVoluntariosDisponibles(
          voluntariosDisponibles.filter(
            (v) => v.idVoluntario !== voluntarioToAdd.idVoluntario
          )
        );
        setSelectedVoluntario("");
        toast.success("Voluntario agregado correctamente");
      } else {
        throw new Error("Failed to add voluntario");
      }
    } catch (error) {
      console.error("Error adding voluntario:", error);
      toast.error("Error al agregar el voluntario.");
    }
  };

  const handleVictimaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVictima(prev => ({
      ...prev,
      [name]: name === "edadVictima" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddVictima = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParteEmergencia) {
      toast.error("No se ha creado un parte de emergencia aún.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/victima/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            ...victima,
            folioPEmergencia: parseInt(idParteEmergencia),
          }),
        }
      );

      if (response.ok) {
        toast.success("Víctima agregada correctamente");
        setVictima({
          rutVictima: "",
          nombreVictima: "",
          edadVictima: 0,
          descripcion: "",
          folioPEmergencia: 0,
        });
      } else {
        throw new Error("Failed to add victima");
      }
    } catch (error) {
      console.error("Error adding victima:", error);
      toast.error("Error al agregar la víctima.");
    }
  };

  const handleInstitucionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstitucion(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInstitucion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParteEmergencia) {
      toast.error("No se ha creado un parte de emergencia aún.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/institucion/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            ...institucion,
            folioPEmergencia: parseInt(idParteEmergencia),
          }),
        }
      );

      if (response.ok) {
        toast.success("Institución agregada correctamente");
        setInstitucion({
          nombreInstitucion: "",
          tipoInstitucion: "",
          nombrePersonaCargo: "",
          horaLlegada: "",
          folioPEmergencia: null,
        });
      } else {
        throw new Error("Failed to add institucion");
      }
    } catch (error) {
      console.error("Error adding institucion:", error);
      toast.error("Error al agregar la institución.");
    }
  };

  const handleInmuebleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInmueble(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInmueble = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParteEmergencia) {
      toast.error("No se ha creado un parte de emergencia aún.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inmueble/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            ...inmueble,
            folioPEmergencia: parseInt(idParteEmergencia),
          }),
        }
      );

      if (response.ok) {
        toast.success("Inmueble agregado correctamente");
        setInmueble({
          direccion: "",
          tipoInmueble: "",
          estadoInmueble: "",
          folioPEmergencia: null,
        });
      } else {
        throw new Error("Failed to add inmueble");
      }
    } catch (error) {
      console.error("Error adding inmueble:", error);
      toast.error("Error al agregar el inmueble.");
    }
  };

  const handleVehiculoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehiculo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVehiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParteEmergencia) {
      toast.error("No se ha creado un parte de emergencia aún.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehiculo/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            ...vehiculo,
            folioPEmergencia: parseInt(idParteEmergencia),
          }),
        }
      );

      if (response.ok) {
        toast.success("Vehículo agregado correctamente");
        setVehiculo({
          patente: "",
          marca: "",
          modelo: "",
          tipoVehiculo: "",
          folioPEmergencia: null,
        });
      } else {
        throw new Error("Failed to add vehiculo");
      }
    } catch (error) {
      console.error("Error adding vehiculo:", error);
      toast.error("Error al agregar el vehículo.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(params);
      if (params?.folio) {
        setParteEmergenciaCompleto(true);
      }
      try {
        const [
          parteEmergenciaRes,
          parteAsistenciaRes,
          voluntariosRes,
          clavesEmergenciaRes,
          materialesPeligrosos,
        ] = await Promise.all([
          params?.folio
            ? fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/buscar/${params?.folio}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                  },
                }
              )
            : Promise.resolve({ ok: true, json: () => ({}) }),

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/obtener`, {
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
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/claveEmergencia/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/materialP/obtener`, {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
        ]);

        if (
          parteEmergenciaRes.ok &&
          parteAsistenciaRes.ok &&
          voluntariosRes.ok &&
          clavesEmergenciaRes.ok
        ) {
          const [
            parteEmergenciaData,
            parteAsistenciaData,
            voluntariosData,
            clavesEmergenciaData,
            materialesPeligrososData,
          ] = await Promise.all([
            parteEmergenciaRes.json(),
            parteAsistenciaRes.json(),
            voluntariosRes.json(),
            clavesEmergenciaRes.json(),
            materialesPeligrosos.json(),
          ]);
          setFormData(parteEmergenciaData as any);
          console.log("folio parte asistencia", parteEmergenciaData);
          setParteAsistenciaOptions(parteAsistenciaData);
          setVoluntarios(voluntariosData);
          setVoluntariosDisponibles(voluntariosData);
          setClaveEmergencia(clavesEmergenciaData);
          setDate(
            parteEmergenciaData.fechaEmergencia
              ? new Date(parteEmergenciaData.fechaEmergencia)
              : new Date()
          );
          setMaterialesPeligrosos(materialesPeligrososData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("No se pudo cargar los datos necesarios");
      }
    };

    fetchData();
  }, [params?.folio]);

  useEffect(() => {
    if (parteEmergenciaCompleto) {
      fetchMoviles().then(() => {
        if (params?.folio) {
          fetchMovilesSeleccionados();
        }
      });
      fetchVoluntarios();
    }
  }, [parteEmergenciaCompleto, params?.folio]);

  console.log("Moviles disponibles:", addedMoviles);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Parte de Emergencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="horaInicio">Hora de Inicio</Label>
                <Input
                  id="horaInicio"
                  name="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                  className="border-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="horaFin">Hora de Fin</Label>
                <Input
                  id="horaFin"
                  name="horaFin"
                  type="time"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                  className="border-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaEmergencia">Fecha</Label>
                <DatePicker
                  date={date}
                  setDate={(date) => setDate(date || new Date())}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="preInforme">Pre-Informe</Label>
                <Textarea
                  id="preInforme"
                  name="preInforme"
                  value={formData.preInforme}
                  onChange={handleChange}
                  required
                  className="border-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="llamarEmpresaQuimica"
                  checked={formData.llamarEmpresaQuimica}
                  onCheckedChange={(checked) =>
                    handleChange(checked, "llamarEmpresaQuimica")
                  }
                />
                <Label htmlFor="llamarEmpresaQuimica">
                  Llamar Empresa Química
                </Label>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idMaterialP">Material Peligroso</Label>
                <Select
                  onValueChange={(value) => handleChange(value, "idMaterialP")}
                  value={
                    formData.idMaterialP === null
                      ? "null"
                      : formData.idMaterialP
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un Material Peligroso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Ninguno</SelectItem>
                    {materialesPeligrosos.map((material) => (
                      <SelectItem
                        key={material.idMaterialP}
                        value={material.idMaterialP.toString()}
                      >
                        {material.idMaterialP} - {material.clasificacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="descripcionMaterialP">
                  Descripción material peligroso
                </Label>
                <Textarea
                  id="descripcionMaterialP"
                  name="descripcionMaterialP"
                  value={formData.descripcionMaterialP}
                  onChange={handleChange}
                  disabled={formData.isDescripcionDisabled}
                  required={!formData.isDescripcionDisabled}
                  className="border-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="direccionEmergencia">
                  Dirección de Emergencia
                </Label>
                <Input
                  id="direccionEmergencia"
                  name="direccionEmergencia"
                  value={formData.direccionEmergencia}
                  onChange={handleChange}
                  required
                  className="border-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idOficial">Oficial</Label>
                <Select
                  onValueChange={(value) => handleChange(value, "idOficial")}
                  value={formData.idOficial}
                >
                  <SelectTrigger id="idOficial" className="w-full">
                    <SelectValue placeholder="Seleccione un Oficial" />
                  </SelectTrigger>
                  <SelectContent>
                    {voluntarios.map((option) => (
                      <SelectItem
                        key={option.idVoluntario}
                        value={option.idVoluntario.toString()}
                      >
                        {option.idVoluntario} - {option.nombreVol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idClaveEmergencia">Clave Emergencia</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "idClaveEmergencia")
                  }
                  value={formData.idClaveEmergencia}
                >
                  <SelectTrigger id="idClaveEmergencia" className="w-full">
                    <SelectValue placeholder="Seleccione Clave Emergencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {claveemergencia.map((option) => (
                      <SelectItem
                        key={option.idClaveEmergencia}
                        value={option.idClaveEmergencia.toString()}
                      >
                        {option.idClaveEmergencia} -{" "}
                        {option.nombreClaveEmergencia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="folioPAsistencia">Folio P. Asistencia</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange(value, "folioPAsistencia")
                  }
                  value={
                    formData.folioPAsistencia === null
                      ? "null"
                      : formData.folioPAsistencia
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un folio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Ninguno</SelectItem>
                    {parteAsistenciaOptions.map((option) => (
                      <SelectItem
                        key={option.folioPAsistencia}
                        value={option.folioPAsistencia.toString()}
                      >
                        {option.folioPAsistencia} - {option.observaciones}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {parteEmergenciaCompleto && (
                <>
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold">
                      Agregar Móviles al Parte de Emergencia
                    </h3>
                    <div className="flex space-x-2">
                      <Select
                        value={selectedMovil}
                        onValueChange={setSelectedMovil}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un Móvil" />
                        </SelectTrigger>
                        <SelectContent>
                          {movilesDisponibles.map((movil) => (
                            <SelectItem
                              key={movil.idMovil}
                              value={movil.idMovil.toString()}
                            >
                              {movil.nomenclatura} - {movil.especialidad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddMovil}>Agregar Móvil</Button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">
                        Móviles Agregados:
                      </h4>
                      <ul className="list-disc pl-5">
                        {addedMoviles.map((movil) => (
                          <li key={movil.idMovil}>
                            {movil.nomenclatura} - {movil.especialidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold">
                      Agregar Voluntarios al Parte de Emergencia
                    </h3>
                    <div className="flex space-x-2">
                      <Select
                        value={selectedVoluntario}
                        onValueChange={setSelectedVoluntario}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un Voluntario" />
                        </SelectTrigger>
                        <SelectContent>
                          {voluntariosDisponibles.map((voluntario) => (
                            <SelectItem
                              key={voluntario.idVoluntario}
                              value={voluntario.idVoluntario.toString()}
                            >
                              {voluntario.claveRadial} - {voluntario.nombreVol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddVoluntario}>
                        Agregar Voluntario
                      </Button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">
                        Voluntarios Agregados:
                      </h4>
                      <ul className="list-disc pl-5">
                        {addedVoluntarios.map((voluntario) => (
                          <li key={voluntario.idVoluntario}>
                            {voluntario.claveRadial} - {voluntario.nombreVol}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">
                      Registrar Víctima
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="rutVictima">RUT Víctima</Label>
                        <Input
                          id="rutVictima"
                          name="rutVictima"
                          value={victima.rutVictima}
                          onChange={handleVictimaChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="nombreVictima">Nombre Víctima</Label>
                        <Input
                          id="nombreVictima"
                          name="nombreVictima"
                          value={victima.nombreVictima}
                          onChange={handleVictimaChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="edadVictima">Edad Víctima</Label>
                      <Input
                        id="edadVictima"
                        name="edadVictima"
                        type="number"
                        value={victima.edadVictima}
                        onChange={handleVictimaChange}
                        required
                        className="border-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        name="descripcion"
                        value={victima.descripcion}
                        onChange={handleVictimaChange}
                        required
                        className="border-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button type="button" onClick={handleAddVictima}>
                      Agregar Víctima
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">
                      Registrar Institución
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="nombreInstitucion">Nombre Institución</Label>
                        <Input
                          id="nombreInstitucion"
                          name="nombreInstitucion"
                          value={institucion.nombreInstitucion}
                          onChange={handleInstitucionChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="tipoInstitucion">Tipo Institución</Label>
                        <Input
                          id="tipoInstitucion"
                          name="tipoInstitucion"
                          value={institucion.tipoInstitucion}
                          onChange={handleInstitucionChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="nombrePersonaCargo">Nombre Persona a Cargo</Label>
                      <Input
                        id="nombrePersonaCargo"
                        name="nombrePersonaCargo"
                        value={institucion.nombrePersonaCargo}
                        onChange={handleInstitucionChange}
                        required
                        className="border-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="horaLlegada">Hora de Llegada</Label>
                      <Input
                        id="horaLlegada"
                        name="horaLlegada"
                        type="time"
                        value={institucion.horaLlegada}
                        onChange={handleInstitucionChange}
                        required
                        className="border-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button type="button" onClick={handleAddInstitucion}>
                      Agregar Institución
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">
                      Registrar Inmueble
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          value={inmueble.direccion}
                          onChange={handleInmuebleChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="tipoInmueble">Tipo de Inmueble</Label>
                        <Select
                          onValueChange={(value) => handleInmuebleChange({ target: { name: "tipoInmueble", value } } as React.ChangeEvent<HTMLSelectElement>)}
                          value={inmueble.tipoInmueble}
                        >
                          <SelectTrigger id="tipoInmueble" className="w-full">
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residencial">Residencial</SelectItem>
                            <SelectItem value="Comercial">Comercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                            <SelectItem value="Terreno">Terreno</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="estadoInmueble">Estado del Inmueble</Label>
                      <Textarea
                        id="estadoInmueble"
                        name="estadoInmueble"
                        value={inmueble.estadoInmueble}
                        onChange={handleInmuebleChange}
                        required
                        className="border-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Describa el estado actual del inmueble"
                      />
                    </div>
                    <Button type="button" onClick={handleAddInmueble}>
                      Agregar Inmueble
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">
                      Registrar Vehículo
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="patente">Patente</Label>
                        <Input
                          id="patente"
                          name="patente"
                          value={vehiculo.patente}
                          onChange={handleVehiculoChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="marca">Marca</Label>
                        <Input
                          id="marca"
                          name="marca"
                          value={vehiculo.marca}
                          onChange={handleVehiculoChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="modelo">Modelo</Label>
                        <Input
                          id="modelo"
                          name="modelo"
                          value={vehiculo.modelo}
                          onChange={handleVehiculoChange}
                          required
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="tipoVehiculo">Tipo de Vehículo</Label>
                        <Select
                          onValueChange={(value) => handleVehiculoChange({ target: { name: "tipoVehiculo", value } } as React.ChangeEvent<HTMLSelectElement>)}
                          value={vehiculo.tipoVehiculo}
                        >
                          <SelectTrigger id="tipoVehiculo" className="w-full">
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Automóvil">Automóvil</SelectItem>
                            <SelectItem value="Camioneta">Camioneta</SelectItem>
                            <SelectItem value="Camión">Camión</SelectItem>
                            <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="button" onClick={handleAddVehiculo}>
                      Agregar Vehículo
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Guardar Parte de Emergencia
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
      <style jsx>{`
        .border-red-500 {
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}

