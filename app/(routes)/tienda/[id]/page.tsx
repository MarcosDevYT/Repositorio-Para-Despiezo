import { MainContainer } from "@/components/layout/MainContainer";
import { TiendaLayout } from "@/components/layout/vendedor/TiendaLayout";

export const dynamic = "force-dynamic";

export default async function TiendaUserPage({
  searchParams,
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: any;
}) {
  const { page = "1", limit = "12" } = await searchParams;
  const { id } = await params;

  return (
    <MainContainer className="min-h-[82.5vh] container mx-auto px-4 py-12">
      <TiendaLayout id={id} limit={limit} page={page} />
    </MainContainer>
  );
}
