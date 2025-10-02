"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { destacarProductAction } from "@/actions/buy-actions";

type ProductType = {
  id: string;
  name: string;
  description: string;
  images: string[];
};

type PlanOption = {
  id: string;
  days: string;
  price: number;
  description: string;
};

export const DestacarProductIndex = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const plans: PlanOption[] = [
    {
      id: "3",
      days: "3 días",
      price: 10,
      description: "Destaca tu producto durante 3 días",
    },
    {
      id: "7",
      days: "7 días",
      price: 20,
      description: "Destaca tu producto durante 7 días",
    },
    {
      id: "15",
      days: "15 días",
      price: 35,
      description: "Destaca tu producto durante 15 días",
    },
    {
      id: "30",
      days: "30 días",
      price: 60,
      description: "Destaca tu producto durante 30 días",
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) setSelectedPlan(plan);
  };

  const handleHighlight = () => {
    startTransition(async () => {
      try {
        const res = await destacarProductAction(
          product.id,
          selectedPlan.price,
          selectedPlan.id
        );

        if (!res?.url) {
          toast.error("Error al iniciar el pago");
          return;
        }

        router.push(res.url);
      } catch (error) {
        toast.error("Ocurrió un error al destacar el producto");
      }
    });
  };

  return (
    <section className="flex flex-col md:flex-row gap-6">
      {/* Selección de planes */}
      <Card className="w-full md:w-6/12">
        <CardHeader>
          <CardTitle>Selecciona un plan de patrocinio</CardTitle>
          <CardDescription>
            Elige durante cuántos días quieres que tu producto aparezca
            destacado
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={selectedPlan.id}
            onValueChange={handleSelect}
            className="grid grid-cols-2 gap-4"
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => handleSelect(plan.id)}
                className={`border p-4 cursor-pointer transition-all ${
                  selectedPlan.id === plan.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg">{plan.days}</h3>
                  <p className="text-sm">{plan.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">€{plan.price}</span>
                    <RadioGroupItem value={plan.id} />
                  </div>
                </div>
              </Card>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Información del producto */}
      <Card className="w-full md:w-6/12">
        <CardHeader>
          <div className="w-full h-72 relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p>{product.description}</p>
          <p className="text-xl font-bold mt-2">€{selectedPlan.price}</p>
          <Button
            onClick={handleHighlight}
            disabled={isPending}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full mt-4 flex items-center justify-center gap-2"
          >
            {isPending ? "Procesando..." : "Destacar Producto"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};
