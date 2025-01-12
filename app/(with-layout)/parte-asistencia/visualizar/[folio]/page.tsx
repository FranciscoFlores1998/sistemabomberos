import VisualizarParteAsistencia from "@/components/parte-asistencia-visualizar";

export default async function AttendanceReportPage({ params }: { params: Promise<{ folio: string }> }) {
  const { folio } = await params;
  return <VisualizarParteAsistencia folio={folio} />;
}

