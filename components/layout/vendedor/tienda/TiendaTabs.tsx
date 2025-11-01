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
import { Kit } from "@/lib/generated/prisma/client";

interface TiendaTabsProps {
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  limitNumber: number;
  isPending: boolean;
  products: ProductType[];
  total: number;
  kits: Kit[];
}

export function TiendaTabs({
  products,
  currentPage,
  handlePageChange,
  limitNumber,
  isPending,
  total,
  kits,
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
          <CardHeader className="gap-0">
            <div className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-y-2">
              <CardTitle className="text-xl">Reseñas</CardTitle>
              <CardDescription>
                <Badge className="rounded-full py-1 text-sm bg-blue-500/10 text-blue-500">
                  {kits.length} Reseñas
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">Reseñas</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
