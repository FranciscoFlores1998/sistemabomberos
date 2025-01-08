import FormVoluntario from "@/components/form-voluntario"



export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const id = (await params).id
    return <FormVoluntario params={{ id }} />
  }