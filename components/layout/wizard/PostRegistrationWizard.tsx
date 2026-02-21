"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainContainer } from "@/components/layout/MainContainer";
import { Search, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardSearchFlow } from "./WizardSearchFlow";
import { WizardSellFlow } from "./WizardSellFlow";

type WizardStep = "choice" | "search" | "sell";

interface Props {
  userName: string;
}

export const PostRegistrationWizard = ({ userName }: Props) => {
  const [step, setStep] = useState<WizardStep>("choice");
  const router = useRouter();

  const handleSkip = () => {
    router.push("/");
  };

  if (step === "search") {
    return <WizardSearchFlow onBack={() => setStep("choice")} />;
  }

  if (step === "sell") {
    return <WizardSellFlow onBack={() => setStep("choice")} />;
  }

  return (
    <MainContainer className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="size-4" />
            Bienvenido a Despiezo
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¡Hola, {userName}!
          </h1>
          <p className="text-gray-500 text-lg">
            ¿Qué te gustaría hacer hoy?
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Buscar pieza */}
          <button
            onClick={() => setStep("search")}
            className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-400 p-6 md:p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="bg-blue-50 group-hover:bg-blue-100 rounded-xl p-3 w-fit mb-4 transition-colors">
              <Search className="size-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Buscar pieza
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Encuentra la pieza que necesitas por OEM, matrícula o marca y modelo.
            </p>
            <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              Buscar ahora
              <ArrowRight className="size-4" />
            </div>
          </button>

          {/* Vender pieza */}
          <button
            onClick={() => setStep("sell")}
            className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-emerald-400 p-6 md:p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer"
          >
            <div className="bg-emerald-50 group-hover:bg-emerald-100 rounded-xl p-3 w-fit mb-4 transition-colors">
              <ShoppingBag className="size-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Vender pieza
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Publica tu primera pieza de forma rápida y sencilla. ¡Es gratis!
            </p>
            <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
              Publicar ahora
              <ArrowRight className="size-4" />
            </div>
          </button>
        </div>

        {/* Skip */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            Omitir e ir a la tienda
          </Button>
        </div>
      </div>
    </MainContainer>
  );
};
