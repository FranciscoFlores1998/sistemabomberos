'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormParteAsistencia from './form-parte-asistencia'
import { AgregarMovilesVoluntarios } from './AgregarMovilesVoluntarios'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { EditarMovilesVoluntarios } from './EditarMovilesVoluntarios'

export default function TwoStepAttendanceForm({ params }: { params?: { folio: string } }) {
  const [step, setStep] = useState(1)
  const [idParteAsistencia, setIdParteAsistencia] = useState<number | null>(null)
  const methods = useForm({ mode: 'onChange' })
  const router = useRouter()

  const onSubmitStep1 = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/guardar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("AQUIAQUIAQU",responseData);
        setIdParteAsistencia(responseData.folioPAsistencia);
        setStep(2);
        toast.success(params?.folio
          ? "Parte de asistencia actualizado exitosamente"
          : "Parte de asistencia registrado exitosamente");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el parte de asistencia');
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(`Hubo un error al ${params?.folio ? "actualizar" : "registrar"} el parte de asistencia.`);
    }
  }

  const onSubmitStep2 = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-asistencia/actualizar/${idParteAsistencia}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("revisar folio",responseData);
        toast.success("Parte de asistencia completado exitosamente");
        router.push("/parte-asistencia");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el parte de asistencia');
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Hubo un error al completar el parte de asistencia.");
    }
  }

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {params?.folio
              ? "Editar Parte de Asistencia"
              : "Registro de Partes de Asistencias"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <FormParteAsistencia 
              params={params} 
              onSubmitStep1={onSubmitStep1}
              setIdParteAsistencia={setIdParteAsistencia}
            />
          ) : (
            <AgregarMovilesVoluntarios 
              folioPAsistencia={idParteAsistencia!} 
              onSubmitStep2={onSubmitStep2}
            />
          )}
          <div className="flex justify-between mt-4">
            {step === 2 && (
              <Button onClick={() => setStep(1)}>
                Anterior
              </Button>
            )}
            {step === 1 ? (
              <Button onClick={methods.handleSubmit(onSubmitStep1)}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={methods.handleSubmit(onSubmitStep2)}>
                Finalizar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </FormProvider>
  )
}

