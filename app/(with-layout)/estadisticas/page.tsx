import cookie from "js-cookie"


export default function Estadisticas() {

  console.log(cookie.get("login"));
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
        estadisticas
    </div>
  )
}

