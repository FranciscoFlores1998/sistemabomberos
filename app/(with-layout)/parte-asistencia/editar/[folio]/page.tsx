import TwoStepAttendanceForm from "@/components/dos-pasos-parte-asistencia"

export default async function Page({
    params,
  }: {
    params: Promise<{ folio: string }>
  }) {
    const folio = (await params).folio
    return <TwoStepAttendanceForm params={{ folio }} />
  }