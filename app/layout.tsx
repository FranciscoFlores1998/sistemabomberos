import { cookies } from 'next/headers'
import './globals.css'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema Bomberos',
  description: 'Aplicación de gestión para bomberos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

