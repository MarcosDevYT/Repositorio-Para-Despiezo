import { ProductType } from "@/types/ProductTypes";
import { ProductCard } from "../ProductComponents/ProductCard";

export const ProfileFavoritos = ({ products }: { products: ProductType[] }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold p-4 w-full bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        Tus Favoritos
      </h1>

      {products.length === 0 ? (
        <div className="p-6 text-center text-gray-500 border border-dashed rounded-xl bg-gray-50">
          <p className="text-lg">No tienes productos favoritos aún.</p>
          <p className="text-sm mt-2">
            Explora nuestra tienda y agrega tus favoritos para verlos aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={product.isFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
