import TwoStepAttendanceForm from "@/components/two-step-parte-asistencia"

export default async function Page({
    params,
  }: {
    params: Promise<{ folio: string }>
  }) {
    const folio = (await params).folio
    return <TwoStepAttendanceForm params={{ folio }} />
  }