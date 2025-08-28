import { getProductByIdAction } from "@/actions/sell-actions";
import { getUserAction } from "@/actions/user-actions";
import { ProductLayout } from "@/components/layout/ProductComponents/ProductLayout";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const product = await getProductByIdAction(id);

  if (!product || "error" in product) {
    return <div>Producto no encontrado</div>;
  }

  const vendedor = await getUserAction(product.vendorId);

  if (!vendedor || "error" in vendedor) {
    return <div>Vendedor no encontrado</div>;
  }

  return <ProductLayout product={product} vendedor={vendedor.user} />;
}
