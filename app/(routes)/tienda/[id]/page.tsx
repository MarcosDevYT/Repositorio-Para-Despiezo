import { getVendorAnalytics } from "@/actions/action-cache";
import { getVendedorKits } from "@/actions/kit-actions";
import { getVendedorReviews } from "@/actions/review-actions";
import { getUserAction } from "@/actions/user-actions";

import { MainContainer } from "@/components/layout/MainContainer";
import { TiendaLayout } from "@/components/layout/vendedor/tienda/TiendaLayout";

export const dynamic = "force-dynamic";

export default async function TiendaUserPage({
  searchParams,
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "12" } = await searchParams;
  const { id } = await params;

  // Cargar datos base del vendedor
  const [kits, analytics, vendedorInfo, reviews] = await Promise.all([
    getVendedorKits(id),
    getVendorAnalytics(id),
    getUserAction(id),
    getVendedorReviews(id),
  ]);

  console.log(reviews);

  return (
    <MainContainer className="min-h-[82.5vh] container mx-auto px-4 py-12">
      <TiendaLayout
        id={id}
        limit={limit}
        page={page}
        kits={kits}
        analytics={analytics}
        vendedorInfo={vendedorInfo.user!}
        reviews={reviews}
      />
    </MainContainer>
  );
}
