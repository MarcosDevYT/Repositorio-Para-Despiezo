import { Hero2 } from "@/components/layout/home2/Hero2";
import { MainContainer } from "@/components/layout/MainContainer";
import { ProductSection2 } from "@/components/layout/home2/ProductSection2";
import { Categories2 } from "@/components/layout/home2/Categories2";
import { ToolsSection } from "@/components/layout/home/ToolsSection";
import {
  getLastViewedProducts,
  getRecommendedProductsForUser,
} from "@/actions/sell-actions";
import { auth } from "@/auth";
import {
  getFeaturedProductsCached,
  getPopularProductsCached,
  getProductsCached,
} from "@/actions/action-cache";
import { Sparkles, TrendingUp, Clock, Heart, Zap, Package } from "lucide-react";

export const dynamic = "auto";
export const revalidate = 600;

export default async function Home2() {
  const session = await auth();
  const userId = session?.user.id;

  // datos dependientes de usuario — dinámicos
  const [lastProductView, recommendedProductsByUser] = await Promise.all([
    getLastViewedProducts(userId),
    getRecommendedProductsForUser(userId),
  ]);

  // datos cacheables globales con revalidación
  const [featuredProducts, popularProducts, products] = await Promise.all([
    getFeaturedProductsCached(),
    getPopularProductsCached(),
    getProductsCached(),
  ]);

  return (
    <MainContainer>
      {/* Hero mejorado */}
      <Hero2 />

      {/* Contenido Principal */}
      <div className="w-full">
        {/* Categorías con diseño impactante */}
        <Categories2 />

        {/* Productos destacados */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="container mx-auto px-4 lg:px-6">
            <ProductSection2
              title="✨ Destacados"
              subtitle="Las mejores ofertas seleccionadas para ti"
              products={featuredProducts}
              icon={<Sparkles className="w-10 h-10 text-white" />}
              gradient="from-yellow-400 to-orange-600"
            />
          </div>
        )}

        {/* Productos más buscados */}
        {popularProducts && popularProducts.length > 0 && (
          <div className="container mx-auto px-4 lg:px-6">
            <ProductSection2
              title="🔥 Lo más buscado"
              subtitle="Productos populares entre nuestros usuarios"
              products={popularProducts}
              icon={<TrendingUp className="w-10 h-10 text-white" />}
              gradient="from-red-500 to-pink-600"
            />
          </div>
        )}

        {/* Productos vistos recientemente */}
        {lastProductView && lastProductView.length > 0 && (
          <div className="container mx-auto px-4 lg:px-6">
            <ProductSection2
              title="👀 Vistos recientemente"
              subtitle="Continúa donde lo dejaste"
              products={lastProductView}
              icon={<Clock className="w-10 h-10 text-white" />}
              gradient="from-purple-500 to-indigo-600"
            />
          </div>
        )}

        {/* Recomendaciones personalizadas */}
        {recommendedProductsByUser && recommendedProductsByUser.length > 0 && (
          <div className="container mx-auto px-4 lg:px-6">
            <ProductSection2
              title="💝 Para ti"
              subtitle="Recomendaciones basadas en tus intereses"
              products={recommendedProductsByUser}
              icon={<Heart className="w-10 h-10 text-white" />}
              gradient="from-pink-500 to-rose-600"
            />
          </div>
        )}

        {/* Herramientas de búsqueda */}
        <div className="container mx-auto px-4 lg:px-6">
          <ToolsSection />
        </div>

        {/* Recién llegados */}
        {products && products.length > 0 && (
          <div className="container mx-auto px-4 lg:px-6">
            <ProductSection2
              title="🆕 Recién llegados"
              subtitle="Las últimas piezas añadidas al catálogo"
              products={products}
              icon={<Package className="w-10 h-10 text-white" />}
              gradient="from-green-500 to-emerald-600"
            />
          </div>
        )}

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-primary via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40">
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span className="text-white font-bold text-sm">¡Únete a miles de usuarios satisfechos!</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-xl text-white/90 font-medium">
                Publica tu pieza y alcanza miles de compradores potenciales
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <a
                  href="/vendedor"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <Package className="w-5 h-5" />
                  Vender mi pieza
                </a>
                <a
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300"
                >
                  Explorar catálogo
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainContainer>
  );
}
