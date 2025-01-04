import { cookies } from "next/headers";

export async function CreateCookie(name:string,value:any) {
    const cookieStore = await cookies();
    cookieStore.set(name,JSON.stringify(value));
}