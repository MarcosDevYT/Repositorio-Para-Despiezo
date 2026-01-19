"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { categories } from "@/lib/constants/data";
import Link from "next/link";

const gradients = [
  "from-red-400 to-pink-600",
  "from-orange-400 to-red-600",
  "from-yellow-400 to-orange-600",
  "from-green-400 to-emerald-600",
  "from-teal-400 to-cyan-600",
  "from-blue-400 to-indigo-600",
  "from-indigo-400 to-purple-600",
  "from-purple-400 to-pink-600",
  "from-pink-400 to-rose-600",
];

export const Categories2 = () => {
  return (
    <section className="py-16 px-2 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        {/* Badge decorativo */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-sm font-bold text-primary">Todas las categorías</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Explora por Categorías
          </span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Miles de piezas organizadas para que encuentres exactamente lo que necesitas
        </p>
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 max-w-7xl mx-auto">
        {/* Categoría "Todos" */}
        <Link href="/productos" className="group animate-in fade-in zoom-in-95 duration-500">
          <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background to-muted/50 h-full">
            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full space-y-3">
              {/* Icono con gradiente y animación */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                {/* Anillo animado */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-purple-600 opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300"></div>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-primary transition-colors">
                  Todos los productos
                </h3>
                <p className="text-xs text-muted-foreground font-semibold">
                  +10,000 productos
                </p>
              </div>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
            </CardContent>
          </Card>
        </Link>

        {/* Categorías dinámicas */}
        {categories.map((category, index) => {
          const Icon = category.icon;
          const gradient = gradients[index % gradients.length];
          
          return (
            <Link
              key={category.id}
              href={
                category.slug === "todas-las-categorias"
                  ? "/productos"
                  : `/productos?categoria=${category.slug}`
              }
              className="group animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="relative overflow-hidden border-2 border-border/50 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background to-muted/50 h-full">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full space-y-3">
                  {/* Icono con gradiente único */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Anillo animado */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300`}></div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {category.count}
                    </p>
                  </div>

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* CTA inferior */}
      <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
        >
          <ShoppingBag className="w-5 h-5" />
          Ver todo el catálogo
        </Link>
      </div>
    </section>
  );
};
