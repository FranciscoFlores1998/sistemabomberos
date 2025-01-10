import VolunteerViewer from "@/components/volunteer-viewer";
import { cookies } from "next/headers";

export default async function VolunteerPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("login");

  const parsedUser = JSON.parse(user?.value);

  return <VolunteerViewer id={parsedUser.usuario.idUsuario} />;
}
