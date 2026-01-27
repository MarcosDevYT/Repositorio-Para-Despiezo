"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Car, Bike, Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  isLoading: boolean;
  progress: number;
  message?: string;
}

const ICONS = [
  { component: Car, name: "coche" },
  { component: Bike, name: "moto" },
  { component: Truck, name: "furgón" }
];

export const LoadingOverlay = ({ isLoading, progress, message = "Buscando vehículo..." }: LoadingOverlayProps) => {
  const [mounted, setMounted] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Alternar iconos cada 2 segundos
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setIconIndex((prev) => (prev + 1) % ICONS.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPadding = document.body.style.paddingRight;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = originalPadding;
      };
    }
  }, [isLoading]);

  if (!mounted || !isLoading) return null;

  const ActiveIcon = ICONS[iconIndex].component;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ isolation: 'isolate' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-8 border border-slate-100 animate-in zoom-in-95 duration-300 ease-out">
        {/* Iconos alternantes con transición suave */}
        <div className="flex justify-center h-24 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse scale-150" />
            <div className="relative bg-primary p-6 rounded-full shadow-inner transition-all duration-500">
              <ActiveIcon className="h-12 w-12 text-white animate-in fade-in zoom-in duration-500" />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{message}</h3>
          <p className="text-sm text-slate-500 font-medium">
            Estamos analizando los datos técnicos...
          </p>
        </div>

        {/* Barra de progreso fluida */}
        <div className="space-y-4">
          <Progress value={progress} className="h-3 bg-slate-100" />
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Estado</span>
              <span className="text-xs font-semibold text-slate-600 italic">Procesando información</span>
            </div>
            <span className="font-black text-primary text-4xl tabular-nums leading-none tracking-tighter">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Indicador de actividad sutil */}
        <div className="flex justify-center gap-2 pt-2">
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse [animation-delay:200ms]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>,
    document.body
  );
};





