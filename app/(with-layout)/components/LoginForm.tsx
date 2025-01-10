'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { getUserFromCookie } from "@/utils/auth";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      nombreUsuario: username,
      contrasena: password
    }
    console.log(data);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.status == 401) {
      cookie.set("login", "false");
      alert("Usuario o contraseña incorrecta");
      return;
    }
    const fetchData = await response.json();
    cookie.set("login", JSON.stringify(fetchData));
    console.log(JSON.stringify(fetchData));
    
    // Obtener el objeto de usuario después de iniciar sesión
    const user = getUserFromCookie();
    console.log("Usuario actual:", user);

    router.push('/')
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSubmit}>Ingresar</Button>
      </CardFooter>
    </Card>
  );
}

