'use client'

import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/datepicker'
import { formatearFecha } from '@/lib/formatearFecha'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import FallbackSpinner from './ui/spinner'

interface Voluntario {
  idVoluntario: number
  nombreVol: string
  claveRadial: string
}

interface TipoCitacion {
  idTipoLlamado: number
  nombreTipoLlamado: string
}

interface FormParteAsistenciaProps {
  params?: { folio: string }
  onSubmitStep1: (data: any) => Promise<void>
  setIdParteAsistencia: (id: number) => void
}

export default function FormParteAsistencia({
  params,
  onSubmitStep1,
  setIdParteAsistencia,
}: FormParteAsistenciaProps) {
  const [loading, setLoading] = useState(true)
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [citaciones, setCitaciones] = useState<TipoCitacion[]>([])
  
  const { register, setValue, watch, formState: { errors } } = useFormContext()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [voluntariosResponse, citacionesResponse] 
      = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-citacion/obtener`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
      ]);

      if (voluntariosResponse.ok && citacionesResponse.ok) {
        const [voluntariosData, citacionesData] = await Promise.all([
          voluntariosResponse.json(),
          citacionesResponse.json()
        ]);

        setVoluntarios(voluntariosData);
        setCitaciones(citacionesData);
      } else {
        throw new Error('Error al obtener datos');
      }

      if (params?.folio) {
        const parteAsistenciaResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/buscar/${params.folio}`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (parteAsistenciaResponse.ok) {
          const data = await parteAsistenciaResponse.json();
          Object.keys(data).forEach(key => {
            setValue(key, data[key]);
          });
          setDate(new Date(data.fechaAsistencia));
        } else {
          throw new Error('Error al obtener datos del parte de asistencia');
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Hubo un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData()
  }, [params?.folio, setValue])

  if (loading) {
    return <FallbackSpinner />
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmitStep1(watch());
    }} className="grid w-full items-center gap-4">
      <div className="flex flex-col gap-y-2 space-y-1.5">
        <Label htmlFor="idTipoLlamado">Tipo de asistencia</Label>
        <Select
          onValueChange={(value) => setValue("idTipoLlamado", value)}
          value={watch("idTipoLlamado")}
        >
          <SelectTrigger
            className={`w-full ${
              errors.idTipoLlamado ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Seleccione el tipo de asistencia" />
          </SelectTrigger>
          <SelectContent>
            {citaciones.map((option) => (
              <SelectItem
                key={option.idTipoLlamado}
                value={option.idTipoLlamado.toString()}
              >
                {option.idTipoLlamado} - {option.nombreTipoLlamado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3  gap-y-3 mb-4">
        <div className="flex flex-col gap-y-2 space-y-1.5">
          <Label htmlFor="horaInicio">Hora de Inicio</Label>
          <Input
            id="horaInicio"
            type="time"
            {...register("horaInicio", { required: true })}
            className={errors.horaInicio ? "border-red-500" : ""}
          />
        </div>
        <div className="flex flex-col gap-y-2 space-y-1.5">
          <Label htmlFor="horaFin">Hora de Fin</Label>
          <Input
            id="horaFin"
            type="time"
            {...register("horaFin", { required: true })}
            className={errors.horaFin ? "border-red-500" : ""}
          />
        </div>
        <div className="flex flex-col gap-y-2  space-y-1.5">
          <Label htmlFor="fechaAsistencia">Fecha</Label>
          <DatePicker
            date={date}
            setDate={(date) => {
              setDate(date || new Date())
              setValue("fechaAsistencia", formatearFecha(date?.toISOString() || new Date().toISOString()))
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 space-y-1.5">
        <Label htmlFor="direccionAsistencia">Dirección</Label>
        <Input
          id="direccionAsistencia"
          {...register("direccionAsistencia", { required: true })}
          className={errors.direccionAsistencia ? "border-red-500" : ""}
        />
      </div>
      <div className="flex flex-col gap-y-2 space-y-1.5">
        <Label htmlFor="aCargoDelCuerpo">Oficial a cargo del Cuerpo</Label>
        <Select
          onValueChange={(value) => setValue("aCargoDelCuerpo", value)}
          value={watch("aCargoDelCuerpo")}
        >
          <SelectTrigger className="w-full">
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
      <div className="flex flex-col gap-y-2 space-y-1.5">
        <Label htmlFor="aCargoDeLaCompania">Oficial de la Compañia</Label>
        <Select
          onValueChange={(value) => setValue("aCargoDeLaCompania", value)}
          value={watch("aCargoDeLaCompania")}
        >
          <SelectTrigger className="w-full">
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
      <div className="flex flex-col gap-y-2 space-y-1.5">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          {...register("observaciones", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-y-2 space-y-1.5">
        <Label htmlFor="totalAsistencia">Total Asistencia</Label>
        <Input
          id="totalAsistencia"
          {...register("totalAsistencia", { required: true })}
          className={errors.totalAsistencia ? "border-red-500" : ""}
        />
      </div>
      {/* <Button type="submit" className="mt-4">Siguiente</Button> */}
    </form>
  )
}

