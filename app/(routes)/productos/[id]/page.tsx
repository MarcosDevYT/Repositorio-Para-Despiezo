import {
  getProductByIdCached,
  registerUserProductViewCached,
  getUserCached,
  getRelatedProductsCached,
  getRecommendedProductsByProductIdCached,
  getKitsByProductIdCached,
} from "@/actions/action-cache";
import { getProductFavoriteStatus } from "@/actions/sell-actions";
import { auth } from "@/auth";
import { ProductLayout } from "@/components/layout/ProductComponents/ProductLayout";
import ProductsRelationed from "@/components/layout/ProductComponents/ProductsRelationed";

export const dynamic = "auto";
export const revalidate = 3600;

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user.id;
  
  // 1. Datos del producto y vendedor (Globales)
  const product = await getProductByIdCached(id);

  if (!product || "error" in product) {
    return <div className="flex items-center justify-center min-h-[50vh]">Producto no encontrado</div>;
  }

  // 2. Datos relacionados (También cacheados)
  const [vendedorResult, relatedProducts, recommendedProducts, kits] = await Promise.all([
    getUserCached(product.vendorId),
    getRelatedProductsCached(id, product.vendorId, userId),
    getRecommendedProductsByProductIdCached(id, userId),
    getKitsByProductIdCached(id),
  ]);

  if (!vendedorResult || "error" in vendedorResult) {
    return <div className="flex items-center justify-center min-h-[50vh]">Vendedor no encontrado</div>;
  }

  // 3. Datos dinámicos (Por usuario)
  const isFavorite = await getProductFavoriteStatus(id);

  if (userId) {
    // Registro de vista asíncrono
    registerUserProductViewCached(userId, product.id).catch(console.error);
  }

  return (
    <>
      <ProductLayout
        product={{ ...product, isFavorite }}
        vendedor={vendedorResult.user}
        session={session}
      />
      <ProductsRelationed
        productId={id}
        vendedorId={product.vendorId}
        userId={userId}
        initialRelated={relatedProducts}
        initialRecommended={recommendedProducts}
        initialKits={kits}
      />
    </>
  );
}
