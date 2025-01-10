"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { useForm, Controller } from "react-hook-form"

interface Movil {
  idMovil: number
  nomenclatura: string
  especialidad: string
}

interface Voluntario {
  idVoluntario: number
  nombreVol: string
  claveRadial: string
}

interface Props {
  folioPAsistencia: number
}

export function AgregarMovilesVoluntarios({ folioPAsistencia }: Props) {
  const [moviles, setMoviles] = useState<Movil[]>([])
  const [movilesDisponibles, setMovilesDisponibles] = useState<Movil[]>([])
  const [voluntariosDisponibles, setVoluntariosDisponibles] = useState<Voluntario[]>([])
  const [addedMoviles, setAddedMoviles] = useState<Movil[]>([])
  const [addedVoluntarios, setAddedVoluntarios] = useState<Voluntario[]>([])

  const { control, handleSubmit, reset } = useForm()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseMoviles, responseVoluntarios] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/movil/obtener`, {
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
        ])

        if (responseMoviles.ok && responseVoluntarios.ok) {
          const [dataMoviles, dataVoluntarios] = await Promise.all([
            responseMoviles.json(),
            responseVoluntarios.json(),
          ])

          setMoviles(dataMoviles)
          setMovilesDisponibles(dataMoviles)
          setVoluntariosDisponibles(dataVoluntarios)
        } else {
          toast.error("Hubo un error al obtener los datos.")
        }
      } catch (error) {
        console.error("Error al obtener datos:", error)
        toast.error("Hubo un error al conectar con el servidor.")
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (data: any) => {
    if (data.movil) {
      await handleAddMovil(data.movil)
    }
    if (data.voluntario) {
      await handleAddVoluntario(data.voluntario)
    }
    reset()
  }

  const handleAddMovil = async (selectedMovil: string) => {
    const movilToAdd = movilesDisponibles.find(
      (m) => m.idMovil.toString() === selectedMovil
    )
    if (!movilToAdd) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-movil/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            folioPAsistencia: folioPAsistencia,
            idMovil: movilToAdd.idMovil,
          }),
        }
      )

      if (response.ok) {
        setAddedMoviles([...addedMoviles, movilToAdd])
        setMovilesDisponibles(
          movilesDisponibles.filter((m) => m.idMovil !== movilToAdd.idMovil)
        )
        toast.success("Móvil agregado correctamente")
      } else {
        toast.error("Error al agregar el móvil")
      }
    } catch (error) {
      console.error("Error al agregar móvil:", error)
      toast.error("Hubo un error al conectar con el servidor.")
    }
  }

  const handleAddVoluntario = async (selectedVoluntario: string) => {
    const voluntarioToAdd = voluntariosDisponibles.find(
      (v) => v.idVoluntario.toString() === selectedVoluntario
    )
    if (!voluntarioToAdd) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia-voluntario/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            folioPAsistencia: folioPAsistencia,
            idVoluntario: voluntarioToAdd.idVoluntario,
          }),
        }
      )

      if (response.ok) {
        setAddedVoluntarios([...addedVoluntarios, voluntarioToAdd])
        setVoluntariosDisponibles(
          voluntariosDisponibles.filter(
            (v) => v.idVoluntario !== voluntarioToAdd.idVoluntario
          )
        )
        toast.success("Voluntario agregado correctamente")
      } else {
        toast.error("Error al agregar el voluntario")
      }
    } catch (error) {
      console.error("Error al agregar voluntario:", error)
      toast.error("Hubo un error al conectar con el servidor.")
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4 mt-6">
          <h3 className="text-lg font-semibold">
            Agregar Móviles al Parte de Asistencia
          </h3>
          <div className="flex space-x-2">
            <Controller
              name="movil"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
            <Button type="submit">Agregar Móvil</Button>
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Móviles Agregados:</h4>
            <ul className="list-disc pl-5">
              {addedMoviles.map((movil) => (
                <li key={movil.idMovil}>
                  {movil.nomenclatura} - {movil.especialidad}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-6">
          <h3 className="text-lg font-semibold">
            Agregar Voluntarios al Parte de Asistencia
          </h3>
          <div className="flex space-x-2">
            <Controller
              name="voluntario"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
            <Button type="submit">Agregar Voluntario</Button>
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Voluntarios Agregados:</h4>
            <ul className="list-disc pl-5">
              {addedVoluntarios.map((voluntario) => (
                <li key={voluntario.idVoluntario}>
                  {voluntario.claveRadial} - {voluntario.nombreVol}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}

