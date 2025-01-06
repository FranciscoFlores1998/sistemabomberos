'use client'
import Link from "next/link";
import Cookies from "js-cookie";

export default function Header() {
  return (
    <header className="bg-red-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/home" className="text-2xl font-bold">
          Sistema Bomberos
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/home" className="hover:underline">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/parte-asistencia" className="hover:underline">Parte de Asistencia</Link>
          </li>
          <li>
            <Link href="/parte-emergencia" className="hover:underline">Parte de Emergencia</Link>
          </li>
          <li>
            <Link href="/estadisticas" className="hover:underline">Estadisticas</Link>
          </li>
          <li>
            <Link href="/busqueda" className="hover:underline">Voluntarios</Link>
          </li>
          <li>
            <Link href="/voluntario" className="hover:underline">Mis Datos</Link>
          </li>
          <li>
            <Link href="/perfil" className="hover:underline">Perfil</Link>
          </li>
          <li>
            <Link href="/" className="hover:underline" onClick={()=>Cookies.remove("login")}>Cerrar sesión</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
