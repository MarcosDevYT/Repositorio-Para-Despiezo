"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Zap, Shield, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";

export const Hero2 = () => {
  const [searchType, setSearchType] = useState<"oem" | "vehicle">("oem");

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Fondo animado con gradientes múltiples */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-700">
        {/* Orbes animados */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Patrón de cuadrícula */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Badge animado */}
          <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/40 px-6 py-2 text-sm font-semibold hover:bg-white/30 transition-all cursor-default">
              <Zap className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400 animate-pulse" />
              +10,000 piezas disponibles
            </Badge>
          </div>

          {/* Título principal */}
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
              Encuentra tu
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent mt-2 animate-gradient">
                pieza perfecta
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto">
              El marketplace líder de autopartes en España. Calidad garantizada, envío rápido.
            </p>
          </div>

          {/* Buscador mejorado */}
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Tabs de búsqueda */}
              <div className="flex gap-3 sm:gap-4">
                <Button
                  onClick={() => setSearchType("oem")}
                  variant={searchType === "oem" ? "default" : "outline"}
                  className={`flex-1 h-14 text-base font-bold rounded-2xl transition-all ${
                    searchType === "oem"
                      ? "bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/50 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  🔍 Buscar por OEM
                </Button>
                <Button
                  onClick={() => setSearchType("vehicle")}
                  variant={searchType === "vehicle" ? "default" : "outline"}
                  className={`flex-1 h-14 text-base font-bold rounded-2xl transition-all ${
                    searchType === "vehicle"
                      ? "bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/50 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  <Car className="w-5 h-5 mr-2" />
                  Por Vehículo
                </Button>
              </div>

              {/* Campo de búsqueda */}
              <div className="relative">
                <Input
                  placeholder={
                    searchType === "oem"
                      ? "Ej: 8200123456"
                      : "Ej: Toyota Corolla 2020"
                  }
                  className="h-16 text-lg pl-6 pr-40 rounded-2xl border-2 border-border focus:border-primary transition-all shadow-inner"
                />
                <Button className="absolute right-2 top-2 h-12 px-8 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </Button>
              </div>

              {/* Tipo de vehículo - solo visible en modo vehículo */}
              {searchType === "vehicle" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {["Coche", "Moto", "Camión", "Furgoneta"].map((type) => (
                    <button
                      key={type}
                      className="px-4 py-3 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all font-semibold text-sm hover:scale-105"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats confianza - rediseñados */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group cursor-default hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="bg-green-400 rounded-xl p-3 group-hover:rotate-12 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Compra</p>
                  <p className="text-white text-xl font-black">Segura</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group cursor-default hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="bg-blue-400 rounded-xl p-3 group-hover:rotate-12 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Envío en</p>
                  <p className="text-white text-xl font-black">24-48h</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group cursor-default hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-xl p-3 group-hover:rotate-12 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Mejor</p>
                  <p className="text-white text-xl font-black">Precio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onda decorativa en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto text-background"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};
