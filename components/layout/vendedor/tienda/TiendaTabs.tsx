import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "../../ProductComponents/ProductCard";
import { ProductType } from "@/types/ProductTypes";
import { ProductPagination } from "../../ProductComponents/ProductPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { KitCard } from "../../ProductComponents/KitCard";
import { Kit } from "@prisma/client";
import { ReviewCard } from "@/components/ReviewCard";
import { VendedorReview } from "@/actions/review-actions";
import { StarOff } from "lucide-react";

interface TiendaTabsProps {
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  limitNumber: number;
  isPending: boolean;
  products: ProductType[];
  total: number;
  kits: Kit[];
  reviews: VendedorReview[];
}

export function TiendaTabs({
  products,
  currentPage,
  handlePageChange,
  limitNumber,
  isPending,
  total,
  kits,
  reviews,
}: TiendaTabsProps) {
  return (
    <Tabs defaultValue="productos" className="space-y-2">
      <TabsList className="w-full h-11">
        <TabsTrigger className="text-lg" value="productos">
          Productos
        </TabsTrigger>
        <TabsTrigger className="text-lg" value="kits">
          Kits
        </TabsTrigger>
        <TabsTrigger className="text-lg" value="reseñas">
          Reseñas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="productos" className="space-y-6">
        <Card>
          <CardHeader className="gap-0">
            <div className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-y-2">
              <CardTitle className="text-xl">Productos del Vendedor</CardTitle>
              <CardDescription>
                {isPending ? (
                  <Skeleton className="w-28 h-5 rounded-full" />
                ) : (
                  <Badge className="rounded-full py-1 text-sm bg-blue-500/10 text-blue-500">
                    {total} productos encontrados
                  </Badge>
                )}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 place-content-center place-items-center gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={product.isFavorite}
              />
            ))}
          </CardContent>
        </Card>

        <ProductPagination
          total={total}
          currentPage={currentPage}
          pageSize={limitNumber}
          onPageChange={handlePageChange}
        />
      </TabsContent>
      <TabsContent value="kits" className="space-y-6">
        <Card>
          <CardHeader className="gap-0">
            <div className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-y-2">
              <CardTitle className="text-xl">Kits del Vendedor</CardTitle>
              <CardDescription>
                <Badge className="rounded-full py-1 text-sm bg-blue-500/10 text-blue-500">
                  {kits.length} Kits
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {kits.map((kit) => (
          <KitCard key={kit.id} kit={kit} />
        ))}
      </TabsContent>
      <TabsContent value="reseñas" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
              <CardTitle className="text-xl font-semibold">Reseñas</CardTitle>
              <CardDescription>
                <Badge className="rounded-full py-1 text-sm bg-blue-500/10 text-blue-500">
                  {reviews.length} Reseña{reviews.length !== 1 && "s"}
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {reviews.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <StarOff />
              <p className="text-sm">
                Todavía no hay reseñas para este vendedor.
              </p>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
