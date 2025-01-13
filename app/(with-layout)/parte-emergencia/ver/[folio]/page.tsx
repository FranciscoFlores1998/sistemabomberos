import VisualizarParteEmergencia from "@/components/visualizar-parte-emergencia";

export default async function AttendanceReportPage({ params }: { params: Promise<{ folio: string }> }) {
  const { folio } = await params;
  return <VisualizarParteEmergencia folio={folio} />;
}
