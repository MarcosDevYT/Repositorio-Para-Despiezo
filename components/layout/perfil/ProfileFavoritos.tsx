import { ProductType } from "@/types/ProductTypes";
import { ProductCard } from "../ProductComponents/ProductCard";

export const ProfileFavoritos = ({ products }: { products: ProductType[] }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold p-4 w-full bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        Tus Favoritos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={product.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
