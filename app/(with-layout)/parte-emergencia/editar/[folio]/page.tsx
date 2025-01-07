import FormParteEmergencia from "@/components/form-parte-emergencia"



export default async function Page({
    params,
  }: {
    params: Promise<{ folio: string }>
  }) {
    const folio = (await params).folio
    console.log(folio)
    return <FormParteEmergencia params={{ folio }} />
  }