import {
  getProductByIdAction,
  registerUserProductView,
} from "@/actions/sell-actions";
import { getUserAction } from "@/actions/user-actions";
import { auth } from "@/auth";
import { ProductLayout } from "@/components/layout/ProductComponents/ProductLayout";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductByIdAction(id);

  if (!product || "error" in product) {
    return <div>Producto no encontrado</div>;
  }

  const vendedor = await getUserAction(product.vendorId);

  if (!vendedor || "error" in vendedor) {
    return <div>Vendedor no encontrado</div>;
  }

  if (session?.user.id) {
    await registerUserProductView(session.user.id, product.id);
  }

  return (
    <ProductLayout
      product={product}
      vendedor={vendedor.user}
      session={session}
    />
  );
}
