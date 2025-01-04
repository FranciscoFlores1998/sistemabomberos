'use server'
import LoginForm from "../(with-layout)/components/LoginForm";

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Iniciar sesión</h1>
      <LoginForm />
    </div>
  )
}

