import React from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';

interface InmuebleFormProps {
  folioPEmergencia: number | null;
}

interface InmuebleInputs {
  direccion: string;
  tipoInmueble: string;
  estadoInmueble: string;
}

export function InmuebleForm({ folioPEmergencia }: InmuebleFormProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<InmuebleInputs>();

  const onSubmit: SubmitHandler<InmuebleInputs> = async (data) => {
    if (!folioPEmergencia) {
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
            ...data,
            folioPEmergencia,
          }),
        }
      );

      if (response.ok) {
        toast.success("Inmueble agregado correctamente");
        reset();
      } else {
        throw new Error("Failed to add inmueble");
      }
    } catch (error) {
      console.error("Error adding inmueble:", error);
      toast.error("Error al agregar el inmueble.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            {...register("direccion", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.direccion && <span className="text-red-500">{errors.direccion.message}</span>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tipoInmueble">Tipo de Inmueble</Label>
          <Controller
            name="tipoInmueble"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
          {errors.tipoInmueble && <span className="text-red-500">{errors.tipoInmueble.message}</span>}
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="estadoInmueble">Estado del Inmueble</Label>
        <Textarea
          id="estadoInmueble"
          {...register("estadoInmueble", { required: "Este campo es requerido" })}
          className="border-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Describa el estado actual del inmueble"
        />
        {errors.estadoInmueble && <span className="text-red-500">{errors.estadoInmueble.message}</span>}
      </div>
      <Button type="submit">Agregar Inmueble</Button>
    </form>
  );
}

