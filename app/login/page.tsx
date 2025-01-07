'use server'
import LoginForm from "../(with-layout)/components/LoginForm";

export default async function LoginPage() {
  return (
    <div className="bg-blue-950 flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
    </div>
  )
}

