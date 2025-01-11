import React from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';

interface VehiculoFormProps {
  folioPEmergencia: number | null;
}

interface VehiculoInputs {
  patente: string;
  marca: string;
  modelo: string;
  tipoVehiculo: string;
}

export function VehiculoForm({ folioPEmergencia }: VehiculoFormProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<VehiculoInputs>();

  const onSubmit: SubmitHandler<VehiculoInputs> = async (data) => {
    if (!folioPEmergencia) {
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
            ...data,
            folioPEmergencia,
          }),
        }
      );

      if (response.ok) {
        toast.success("Vehículo agregado correctamente");
        reset();
      } else {
        throw new Error("Failed to add vehiculo");
      }
    } catch (error) {
      console.error("Error adding vehiculo:", error);
      toast.error("Error al agregar el vehículo.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="patente">Patente</Label>
          <Input
            id="patente"
            {...register("patente", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.patente && <span className="text-red-500">{errors.patente.message}</span>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="marca">Marca</Label>
          <Input
            id="marca"
            {...register("marca", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.marca && <span className="text-red-500">{errors.marca.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="modelo">Modelo</Label>
          <Input
            id="modelo"
            {...register("modelo", { required: "Este campo es requerido" })}
            className="border-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.modelo && <span className="text-red-500">{errors.modelo.message}</span>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="tipoVehiculo">Tipo de Vehículo</Label>
          <Controller
            name="tipoVehiculo"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
          {errors.tipoVehiculo && <span className="text-red-500">{errors.tipoVehiculo.message}</span>}
        </div>
      </div>
      <Button type="submit">Agregar Vehículo</Button>
    </form>
  );
}

