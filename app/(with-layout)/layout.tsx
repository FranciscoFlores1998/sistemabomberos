import '../globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema Bomberos',
  description: 'Aplicación de gestión para bomberos',
}

export default function WithLayoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} flex flex-col min-h-screen`}>
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  )
}

