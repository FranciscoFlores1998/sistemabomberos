import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-hot-toast';

interface VictimaFormProps {
  folioPEmergencia: number | null;
}

interface VictimaInputs {
  rutVictima: string;
  nombreVictima: string;
  edadVictima: number;
  descripcion: string;
}

export function VictimaForm({ folioPEmergencia }: VictimaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VictimaInputs>();

  const onSubmit: SubmitHandler<VictimaInputs> = async (data) => {
    if (!folioPEmergencia) {
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
            ...data,
            folioPEmergencia,
          }),
        }
      );

      if (response.ok) {
        toast.success("Víctima agregada correctamente");
        reset();
      } else {
        throw new Error("Failed to add victima");
      }
    } catch (error) {
      console.error("Error adding victima:", error);
      toast.error("Error al agregar la víctima.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="rutVictima">RUT Víctima</Label>
          <Input
            id="rutVictima"
            {...register("rutVictima", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.rutVictima && <span className="text-red-500">{errors.rutVictima.message}</span>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="nombreVictima">Nombre Víctima</Label>
          <Input
            id="nombreVictima"
            {...register("nombreVictima", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.nombreVictima && <span className="text-red-500">{errors.nombreVictima.message}</span>}
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="edadVictima">Edad Víctima</Label>
        <Input
          id="edadVictima"
          type="number"
          {...register("edadVictima", { 
            required: "Este campo es requerido",
            min: { value: 0, message: "La edad debe ser mayor o igual a 0" }
          })}
          className="border-2 focus:ring-2 focus:ring-blue-500"
        />
        {errors.edadVictima && <span className="text-red-500">{errors.edadVictima.message}</span>}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          {...register("descripcion", { required: "Este campo es requerido" })}
          className="border-2 focus:ring-2 focus:ring-blue-500"
        />
        {errors.descripcion && <span className="text-red-500">{errors.descripcion.message}</span>}
      </div>
      <Button type="submit">Agregar Víctima</Button>
    </form>
  );
}

