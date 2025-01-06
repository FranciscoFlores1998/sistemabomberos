'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VoluntarioData {
  idVoluntario: number
  nombreVol: string
  fechaNac: string
  direccion: string
  numeroContacto: string
  tipoSangre: string
  enfermedades: string
  alergias: string
  fechaIngreso: string
  claveRadial: string
  rutVoluntario: string
  idCompania: string
  idUsuario: string
  idCargo: number
}

export default function EditarVoluntario() {
  const router = useRouter()
  const params = useParams()
  const [voluntario, setVoluntario] = useState<VoluntarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoluntario = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/buscar/1`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch volunteer data')
        }
        const data = await response.json()
        setVoluntario(data)
      } catch (err) {
        setError('Error fetching volunteer data. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVoluntario()
  }, [params.id])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voluntario/actualizar/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(voluntario),
      })
      if (!response.ok) {
        throw new Error('Failed to update volunteer data')
      }
      router.push('/voluntario')
    } catch (err) {
      setError('Error updating volunteer data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setVoluntario(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">Cargando datos del voluntario...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!voluntario) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent>
            <p className="text-center">No se encontraron datos del voluntario.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Datos de Voluntario</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nombreVol">Nombre</Label>
                <Input id="nombreVol" name="nombreVol" value={voluntario.nombreVol} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                <Input id="fechaNac" name="fechaNac" type="date" value={voluntario.fechaNac} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" value={voluntario.direccion} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="numeroContacto">Número de Contacto</Label>
                <Input id="numeroContacto" name="numeroContacto" value={voluntario.numeroContacto} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                <Input id="tipoSangre" name="tipoSangre" value={voluntario.tipoSangre} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="enfermedades">Enfermedades</Label>
                <Textarea id="enfermedades" name="enfermedades" value={voluntario.enfermedades} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="alergias">Alergias</Label>
                <Textarea id="alergias" name="alergias" value={voluntario.alergias} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <Input id="fechaIngreso" name="fechaIngreso" type="date" value={voluntario.fechaIngreso} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="claveRadial">Clave Radial</Label>
                <Input id="claveRadial" name="claveRadial" value={voluntario.claveRadial} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rutVoluntario">RUT Voluntario</Label>
                <Input id="rutVoluntario" name="rutVoluntario" value={voluntario.rutVoluntario} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/voluntario')}>Cancelar</Button>
            <Button type="submit">Guardar Cambios</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

