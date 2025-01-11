'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { EmergenciaDetallesForm } from './EmergenciaDetallesForm'
import FormParteEmergencia from './form-parte-emergencia'

export default function TwoStepParteEmergencia({ params }: { params?: { folio: string } }) {
  const [step, setStep] = useState(1)
  const [idParteEmergencia, setIdParteEmergencia] = useState<number | null>(null)
  const methods = useForm({ mode: 'onChange' })
  const router = useRouter()

  const onSubmitStep1 = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/guardar`,
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
        setIdParteEmergencia(responseData.folioPEmergencia);
        setStep(2);
        toast.success(params?.folio
          ? "Parte de emergencia actualizado exitosamente"
          : "Parte de emergencia registrado exitosamente");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el parte de emergencia');
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(`Hubo un error al ${params?.folio ? "actualizar" : "registrar"} el parte de emergencia.`);
    }
  }

  const onSubmitStep2 = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/actualizar/${idParteEmergencia}`,
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
        toast.success("Parte de emergencia completado exitosamente");
        router.push("/parte-emergencia");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el parte de emergencia');
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Hubo un error al completar el parte de emergencia.");
    }
  }

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {params?.folio
              ? "Editar Parte de Emergencia"
              : "Registro de Partes de Emergencia"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <FormParteEmergencia 
            params={params}
            onsubmitStep1={onSubmitStep1}
            setIdParteEmergencia={setIdParteEmergencia} 
            />
          ) : (
            <EmergenciaDetallesForm 
              folioPEmergencia={idParteEmergencia!} 
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

