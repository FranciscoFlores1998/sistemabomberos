'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

interface EmergenciaDetallesFormProps {
  folioPEmergencia: number
  onSubmitStep2: (data: any) => Promise<void>
}

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

export function EmergenciaDetallesForm({ folioPEmergencia, onSubmitStep2 }: EmergenciaDetallesFormProps) {
  const [moviles, setMoviles] = useState<Movil[]>([])
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [movilesDisponibles, setMovilesDisponibles] = useState<Movil[]>([])
  const [voluntariosDisponibles, setVoluntariosDisponibles] = useState<Voluntario[]>([])
  const [addedMoviles, setAddedMoviles] = useState<Movil[]>([])
  const [addedVoluntarios, setAddedVoluntarios] = useState<Voluntario[]>([])

  const movilForm = useForm()
  const voluntarioForm = useForm()
  const inmuebleForm = useForm()
  const institucionForm = useForm()
  const vehiculoForm = useForm()
  const victimaForm = useForm()

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
          setVoluntarios(dataVoluntarios)
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

  const onSubmitMovil: SubmitHandler<any> = async (data) => {
    const movilToAdd = movilesDisponibles.find(m => m.idMovil.toString() === data.movil)
    if (!movilToAdd) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia-movil/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ folioPEmergencia, idMovil: movilToAdd.idMovil }),
      });

      if (response.ok) {
        setAddedMoviles([...addedMoviles, movilToAdd])
        setMovilesDisponibles(movilesDisponibles.filter(m => m.idMovil !== movilToAdd.idMovil))
        toast.success("Móvil agregado correctamente");
        movilForm.reset();
      } else {
        toast.error("Error al agregar el móvil");
      }
    } catch (error) {
      console.error("Error al agregar móvil:", error);
      toast.error("Error al agregar el móvil");
    }
  }

  const onSubmitVoluntario: SubmitHandler<any> = async (data) => {
    const voluntarioToAdd = voluntariosDisponibles.find(v => v.idVoluntario.toString() === data.voluntario)
    if (!voluntarioToAdd) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia-voluntario/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ folioPEmergencia, idVoluntario: voluntarioToAdd.idVoluntario }),
      });

      if (response.ok) {
        setAddedVoluntarios([...addedVoluntarios, voluntarioToAdd])
        setVoluntariosDisponibles(voluntariosDisponibles.filter(v => v.idVoluntario !== voluntarioToAdd.idVoluntario))
        toast.success("Voluntario agregado correctamente");
        voluntarioForm.reset();
      } else {
        toast.error("Error al agregar el voluntario");
      }
    } catch (error) {
      console.error("Error al agregar voluntario:", error);
      toast.error("Error al agregar el voluntario");
    }
  }

  const onSubmitInmueble: SubmitHandler<any> = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inmueble/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ folioPEmergencia, ...data }),
      });

      if (response.ok) {
        toast.success("Inmueble agregado correctamente");
        inmuebleForm.reset();
      } else {
        toast.error("Error al agregar el inmueble");
      }
    } catch (error) {
      console.error("Error al agregar inmueble:", error);
      toast.error("Error al agregar el inmueble");
    }
  }

  const onSubmitInstitucion: SubmitHandler<any> = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institucion/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ folioPEmergencia, ...data }),
      });

      if (response.ok) {
        toast.success("Institución agregada correctamente");
        institucionForm.reset();
      } else {
        toast.error("Error al agregar la institución");
      }
    } catch (error) {
      console.error("Error al agregar institución:", error);
      toast.error("Error al agregar la institución");
    }
  }

  const onSubmitVehiculo: SubmitHandler<any> = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehiculo/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ folioPEmergencia, ...data }),
      });

      if (response.ok) {
        toast.success("Vehículo agregado correctamente");
        vehiculoForm.reset();
      } else {
        toast.error("Error al agregar el vehículo");
      }
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      toast.error("Error al agregar el vehículo");
    }
  }

  const onSubmitVictima: SubmitHandler<any> = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/victima/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ folioPEmergencia, ...data }),
      });

      if (response.ok) {
        toast.success("Víctima agregada correctamente");
        victimaForm.reset();
      } else {
        toast.error("Error al agregar la víctima");
      }
    } catch (error) {
      console.error("Error al agregar víctima:", error);
      toast.error("Error al agregar la víctima");
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
     
        <CardContent>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Móviles</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={movilForm.handleSubmit(onSubmitMovil)} className="space-y-4">
                  <div>
                    <Label htmlFor="movil">Móvil</Label>
                    <Controller
                      name="movil"
                      control={movilForm.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un Móvil" />
                          </SelectTrigger>
                          <SelectContent>
                            {movilesDisponibles.map((movil) => (
                              <SelectItem key={movil.idMovil} value={movil.idMovil.toString()}>
                                {movil.nomenclatura} - {movil.especialidad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <Button type="submit">Agregar Móvil</Button>
                </form>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voluntarios</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={voluntarioForm.handleSubmit(onSubmitVoluntario)} className="space-y-4">
                  <div>
                    <Label htmlFor="voluntario">Voluntario</Label>
                    <Controller
                      name="voluntario"
                      control={voluntarioForm.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un Voluntario" />
                          </SelectTrigger>
                          <SelectContent>
                            {voluntariosDisponibles.map((voluntario) => (
                              <SelectItem key={voluntario.idVoluntario} value={voluntario.idVoluntario.toString()}>
                                {voluntario.claveRadial} - {voluntario.nombreVol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <Button type="submit">Agregar Voluntario</Button>
                </form>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inmueble</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={inmuebleForm.handleSubmit(onSubmitInmueble)} className="space-y-4">
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input id="direccion" {...inmuebleForm.register("direccion")} />
                  </div>
                  <div>
                    <Label htmlFor="tipoInmueble">Tipo de Inmueble</Label>
                    <Controller
                      name="tipoInmueble"
                      control={inmuebleForm.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
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
                  </div>
                  <div>
                    <Label htmlFor="estadoInmueble">Estado del Inmueble</Label>
                    <Textarea id="estadoInmueble" {...inmuebleForm.register("estadoInmueble")} />
                  </div>
                  <Button type="submit">Agregar Inmueble</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Institución</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={institucionForm.handleSubmit(onSubmitInstitucion)} className="space-y-4">
                  <div>
                    <Label htmlFor="nombreInstitucion">Nombre Institución</Label>
                    <Input id="nombreInstitucion" {...institucionForm.register("nombreInstitucion")} />
                  </div>
                  <div>
                    <Label htmlFor="tipoInstitucion">Tipo Institución</Label>
                    <Input id="tipoInstitucion" {...institucionForm.register("tipoInstitucion")} />
                  </div>
                  <div>
                    <Label htmlFor="nombrePersonaCargo">Nombre Persona a Cargo</Label>
                    <Input id="nombrePersonaCargo" {...institucionForm.register("nombrePersonaCargo")} />
                  </div>
                  <div>
                    <Label htmlFor="horaLlegada">Hora de Llegada</Label>
                    <Input id="horaLlegada" type="time" {...institucionForm.register("horaLlegada")} />
                  </div>
                  <Button type="submit">Agregar Institución</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehículo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={vehiculoForm.handleSubmit(onSubmitVehiculo)} className="space-y-4">
                  <div>
                    <Label htmlFor="patente">Patente</Label>
                    <Input id="patente" {...vehiculoForm.register("patente")} />
                  </div>
                  <div>
                    <Label htmlFor="marca">Marca</Label>
                    <Input id="marca" {...vehiculoForm.register("marca")} />
                  </div>
                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input id="modelo" {...vehiculoForm.register("modelo")} />
                  </div>
                  <div>
                    <Label htmlFor="tipoVehiculo">Tipo de Vehículo</Label>
                    <Controller
                      name="tipoVehiculo"
                      control={vehiculoForm.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
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
                  </div>
                  <Button type="submit">Agregar Vehículo</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Víctima</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={victimaForm.handleSubmit(onSubmitVictima)} className="space-y-4">
                  <div>
                    <Label htmlFor="rutVictima">RUT Víctima</Label>
                    <Input id="rutVictima" {...victimaForm.register("rutVictima")} />
                  </div>
                  <div>
                    <Label htmlFor="nombreVictima">Nombre Víctima</Label>
                    <Input id="nombreVictima" {...victimaForm.register("nombreVictima")} />
                  </div>
                  <div>
                    <Label htmlFor="edadVictima">Edad Víctima</Label>
                    <Input
                      id="edadVictima"
                      type="number"
                      {...victimaForm.register("edadVictima", {
                        min: { value: 0, message: "La edad debe ser mayor o igual a 0" }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcionVictima">Descripción</Label>
                    <Textarea id="descripcionVictima" {...victimaForm.register("descripcionVictima")} />
                  </div>
                  <Button type="submit">Agregar Víctima</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </CardContent>
    </div>
  )
}

