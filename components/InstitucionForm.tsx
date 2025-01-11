import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast';

interface InstitucionFormProps {
  folioPEmergencia: number | null;
}

interface InstitucionInputs {
  nombreInstitucion: string;
  tipoInstitucion: string;
  nombrePersonaCargo: string;
  horaLlegada: string;
}

export function InstitucionForm({ folioPEmergencia }: InstitucionFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InstitucionInputs>();

  const onSubmit: SubmitHandler<InstitucionInputs> = async (data) => {
    if (!folioPEmergencia) {
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
            ...data,
            folioPEmergencia,
          }),
        }
      );

      if (response.ok) {
        toast.success("Institución agregada correctamente");
        reset();
      } else {
        throw new Error("Failed to add institucion");
      }
    } catch (error) {
      console.error("Error adding institucion:", error);
      toast.error("Error al agregar la institución.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="nombreInstitucion">Nombre Institución</Label>
          <Input
            id="nombreInstitucion"
            {...register("nombreInstitucion", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.nombreInstitucion && <span className="text-red-500">{errors.nombreInstitucion.message}</span>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tipoInstitucion">Tipo Institución</Label>
          <Input
            id="tipoInstitucion"
            {...register("tipoInstitucion", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.tipoInstitucion && <span className="text-red-500">{errors.tipoInstitucion.message}</span>}
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="nombrePersonaCargo">Nombre Persona a Cargo</Label>
        <Input
          id="nombrePersonaCargo"
          {...register("nombrePersonaCargo", { required: "Este campo es requerido" })}
          className="border-2 focus:ring-2 focus:ring-blue-500"
        />
        {errors.nombrePersonaCargo && <span className="text-red-500">{errors.nombrePersonaCargo.message}</span>}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="horaLlegada">Hora de Llegada</Label>
        <Input
          id="horaLlegada"
          type="time"
          {...register("horaLlegada", { required: "Este campo es requerido" })}
          className="border-2 focus:ring-2 focus:ring-blue-500"
        />
        {errors.horaLlegada && <span className="text-red-500">{errors.horaLlegada.message}</span>}
      </div>
      <Button type="submit">Agregar Institución</Button>
    </form>
  );
}

