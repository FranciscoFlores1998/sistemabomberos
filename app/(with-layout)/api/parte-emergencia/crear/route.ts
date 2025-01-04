import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const parteEmergencia = await request.json()

    // Aquí deberías hacer la llamada a tu API backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parte-emergencia/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parteEmergencia),
    })

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error al crear parte de emergencia:', error)
    return NextResponse.json({ error: 'Error al crear parte de emergencia' }, { status: 500 })
  }
}

