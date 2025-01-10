import FormParteAsistencia from "@/components/form-parte-asistencia"

export default async function Page({
    params,
  }: {
    params: Promise<{ folio: string }>
  }) {
    const folio = (await params).folio
    return <FormParteAsistencia params={{ folio }} />
  }