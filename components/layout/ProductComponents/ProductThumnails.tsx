import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState } from "react";
import { Product } from "@prisma/client";
import SwiperCore from "swiper";
import Image from "next/image";
import { X } from "lucide-react";

import "swiper/css";

export const ProductThumnails = ({
  product,
}: {
  product: Product & { isFavorite?: boolean };
}) => {
  const swiperRef = useRef<SwiperCore>(null);
  const modalSwiperRef = useRef<SwiperCore>(null);

  const [openImagesModal, setOpenImagesModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSetImage = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  const handleOpenModal = (index: number) => {
    setActiveIndex(index);
    setOpenImagesModal(true);
  };

  const handleCloseModal = () => {
    setOpenImagesModal(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-1/2">
      {/* Modal */}
      {openImagesModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90">
          {/* Botón de cerrar */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-50 text-white p-2 rounded-full bg-black/50 hover:bg-black"
          >
            <X size={24} />
          </button>

          {/* Swiper fullscreen */}
          <Swiper
            onSwiper={(swiper) => {
              modalSwiperRef.current = swiper;
              swiper.slideToLoop(activeIndex, 0);
            }}
            spaceBetween={20}
            loop
            className="w-full h-full"
          >
            {product.images.map((image, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Swiper principal */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        loop
        className="rounded-lg w-full border border-border h-[400px] md:h-[500px]"
      >
        {product.images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="relative rounded-lg"
            onClick={() => handleOpenModal(index)}
          >
            <Image
              src={image}
              alt={product.name}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <div className="w-full flex flex-nowrap gap-4 overflow-x-auto">
        {product.images.map((image: string, index: number) => (
          <div
            key={index}
            onClick={() => handleSetImage(index)}
            className="relative cursor-pointer flex items-center justify-center min-w-24 h-24 rounded-2xl overflow-clip border"
          >
            <Image
              src={image}
              alt={`${product.name} thumbnail`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
