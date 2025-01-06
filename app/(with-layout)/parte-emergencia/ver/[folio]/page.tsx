
import VisualizarParteEmergencia from "@/components/visualizar-parte-emergencia"

export default async function Page({
    params,
  }: {
    params: Promise<{ folio: string }>
  }) {
    const folio = (await params).folio

    return <VisualizarParteEmergencia params={{ folio }} />
  }