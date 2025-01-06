import EditarParteEmergencia from "@/components/editar-parte-emergencia"

export default async function Page({
    params,
  }: {
    params: Promise<{ folio: string }>
  }) {
    const folio = (await params).folio

    return <EditarParteEmergencia params={{ folio }} />
  }