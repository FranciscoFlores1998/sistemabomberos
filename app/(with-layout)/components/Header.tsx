"use client";

import Cookies from "js-cookie";
import Link from "next/link";

export default function Header() {
  const user = Cookies.get("login");

  const parseUSer = JSON.parse(user);

  return (
    <header className="bg-blue-950 text-white p-4">
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
            <Link href="/parte-asistencia" className="hover:underline">
              Parte de Asistencia
            </Link>
          </li>
          <li>
            <Link href="/parte-emergencia" className="hover:underline">
              Parte de Emergencia
            </Link>
          </li>
          <li>
            <Link href="/reportes" className="hover:underline">
              Gráficas
            </Link>
          </li>
          {parseUSer.cargo.idCargo === 1 && (
            <li>
              <Link href="/voluntario" className="hover:underline">
                Voluntarios
              </Link>
            </li>
          )}
          <Link href="/mis-datos" className="hover:underline">
            Mis Datos
          </Link>
          <li>
            <Link
              href="/"
              className="hover:underline"
              onClick={() => Cookies.remove("login")}
            >
              Cerrar sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
