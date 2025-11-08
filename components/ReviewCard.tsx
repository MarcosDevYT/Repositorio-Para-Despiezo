"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VendedorReview } from "@/actions/review-actions";

export function ReviewCard({ review }: { review: VendedorReview }) {
  const { user, rating, comentario, createdAt, product } = review;

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
      }`}
    />
  ));

  return (
    <Card className="w-full bg-background border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="font-semibold text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(createdAt), "d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center">{stars}</div>

        {comentario && (
          <p className="text-sm text-muted-foreground">{comentario}</p>
        )}

        {product && (
          <div className="flex items-center gap-3 mt-2 border-t pt-3">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-12 w-12 rounded-md object-cover"
              />
            )}
            <div>
              <p className="text-sm font-medium">{product.name}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
