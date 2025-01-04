import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookiesStore = await cookies();
  const login = cookiesStore.get("login");
  console.log(login?.value);
  login?.value == "false" || !login ? redirect('/login'):redirect('/home');
  

}
