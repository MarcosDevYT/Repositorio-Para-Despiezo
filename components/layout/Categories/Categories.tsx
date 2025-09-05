"use client";

import { useEffect, useRef, useState } from "react";
import { CategoriesSidebar } from "./CategoriesSidebar";
import { CategoryDropdown } from "./CategoryDropdown";
import { SearchProducts } from "@/components/searchComponents/SearchProducts";
import { ListFilter, LucideShoppingBag } from "lucide-react";
import { categories } from "@/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const Categories = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = "todas-las-categorias";

  const activeCategoryIndex = categories.findIndex(
    (category) => category.slug === activeCategory
  );

  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const avaibleWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > avaibleWidth) break;

        totalWidth += width;

        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, [categories.length]);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <section>
      <div className="hidden md:flex">
        <div className="relative w-full">
          {/* div oculto para calcular el largo de los items */}
          <div
            ref={measureRef}
            className="absolute opacity-0 pointer-events-none flex container"
            style={{ position: "fixed", top: -9999, left: -9999 }}
          >
            {" "}
            <div>
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "h-11 flex items-center space-x-2 text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 rounded-full px-4  whitespace-nowrap"
                )}
              >
                <Link href={"/productos"}>
                  <LucideShoppingBag className="size-4" />
                  Todos los productos
                </Link>
              </Button>
            </div>
            {categories.map((category) => (
              <div key={category.id}>
                <CategoryDropdown
                  category={category}
                  isActive={activeCategory === category.slug}
                  isNavigationHovered={false}
                />
              </div>
            ))}
          </div>

          {/* Items Visibles */}
          <div
            ref={containerRef}
            className="flex flex-nowrap items-center justify-center container mx-auto"
            onMouseEnter={() => setIsAnyHovered(true)}
            onMouseLeave={() => setIsAnyHovered(false)}
          >
            <div>
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "h-11 flex items-center space-x-2 text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 rounded-full px-4  whitespace-nowrap"
                )}
              >
                <Link href={"/productos"}>
                  <LucideShoppingBag className="size-4" />
                  Todos los productos
                </Link>
              </Button>
            </div>
            {categories.slice(0, visibleCount).map((category) => (
              <div key={category.id}>
                <CategoryDropdown
                  category={category}
                  isActive={activeCategory === category.slug}
                  isNavigationHovered={isAnyHovered}
                />
              </div>
            ))}

            <div ref={viewAllRef} className="shrink-0">
              <Button
                variant="ghost"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={cn(
                  "h-11 flex items-center space-x-2 text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 rounded-full px-4  whitespace-nowrap",
                  isActiveCategoryHidden &&
                    !isAnyHovered &&
                    "bg-white border-primary"
                )}
              >
                Todas las Categorias
                <ListFilter className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CategoriesSidebar */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <div className="flex items-center gap-2 md:hidden">
        <SearchProducts />

        <Button
          onClick={handleOpenSidebar}
          className="rounded-full h-10 w-10"
          size={"icon"}
        >
          <ListFilter className="size-5" />
        </Button>
      </div>
    </section>
  );
};
