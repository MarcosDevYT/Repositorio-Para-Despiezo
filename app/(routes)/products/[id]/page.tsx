import { getProductByIdAction } from "@/actions/sell-actions";
import { ProductLayout } from "@/components/layout/ProductComponents/ProductLayout";

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

  return <ProductLayout product={product} />;
}
