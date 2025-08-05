"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { productsArray } from "@/data";
import { getConditionColor } from "@/lib/utils";
import { Star, MapPin, MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import "swiper/css";
import Image from "next/image";

export default function ProductPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const product = productsArray.find((product) => product.id === id);

  const [isFavorite, setIsFavorite] = useState(false);
  const conditionColor = getConditionColor(product?.condition ?? "nuevo");

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <section className="flex flex-col lg:flex-row gap-16">
      <Swiper
        spaceBetween={30}
        centeredSlides={false}
        loop={true}
        className="mySwiper  rounded-lg w-full lg:w-1/2 border border-border h-[400px] md:h-[500px] lg:h-[700px]"
      >
        {product.images.map((image, index) => (
          <SwiperSlide key={index} className="rounded-lg relative">
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-contain rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Product Info */}
      <div className="space-y-5 relative">
        <Button
          size="icon"
          variant={"ghost"}
          className="absolute top-0 right-0 rounded-full "
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart
            className={`size-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>

        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="size-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">
              ({product.reviewCount} reseñas)
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {product.title}
          </h1>

          {/* Category and Condition */}
          <div className="flex items-center space-x-3 mb-4">
            <Badge
              variant={"outline"}
              className="bg-blue-500/10 text-blue-500 border-blue-500/20"
            >
              {product.category}
            </Badge>
            <Badge variant="outline" className={conditionColor}>
              {product.condition}
            </Badge>
          </div>

          {/* Price */}
          <span className="text-3xl font-bold text-primary">
            ${product.price}
          </span>
        </div>

        <Separator />

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Detalles del producto</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Marca:</span>
              <p className="font-medium">{product.brand}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Modelo:</span>
              <p className="font-medium">{product.model}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Año:</span>
              <p className="font-medium">{product.year}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Estado:</span>
              <p className="font-medium">{product.condition}</p>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Número OEM:</span>
            <p className="font-medium text-lg">{product.oemNumber}</p>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{product.location}</span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Descripción</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-3 w-fit">
            <Button
              className="w-full rounded-full bg-green-500 text-white border-green-500/20 hover:bg-green-600"
              onClick={() => {
                // Aquí iría la lógica para chatear con el vendedor
                console.log("Chatear con vendedor");
              }}
            >
              <MessageCircle className="size-5" />
              Chatear con el vendedor
            </Button>

            <Button className="w-full rounded-full bg-blue-500 text-white border-blue-500/20 hover:bg-blue-600">
              <ShoppingCart className="size-5" />
              Comprar ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
