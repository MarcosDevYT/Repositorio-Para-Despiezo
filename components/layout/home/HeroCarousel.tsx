"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/hero-banner.jpg",
    title: "Encuentra las mejores partes para tu auto",
    subtitle: "Partes de segunda mano verificadas y garantizadas",
    cta: "Explorar Productos",
    link: "/products",
  },
  {
    id: 2,
    image: "/hero-banner.jpg",
    title: "Vende tus partes usadas fácilmente",
    subtitle: "Conecta con compradores de toda la región",
    cta: "Vender Ahora",
    link: "/products",
  },
  {
    id: 3,
    image: "/hero-banner.jpg",
    title: "Ofertas especiales de la semana",
    subtitle: "Hasta 70% de descuento en partes seleccionadas",
    cta: "Ver Ofertas",
    link: "/products",
  },
];

export function HeroCarousel() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={false}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay]}
        className="mySwiper h-96 rounded-lg"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="rounded-lg">
            <div
              className="w-full h-full flex flex-col items-center justify-center text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90 text-center">
                {slide.subtitle}
              </p>
              <Button className="text-base w-max px-8 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-700">
                <Link href={slide.link}> {slide.cta}</Link>
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
