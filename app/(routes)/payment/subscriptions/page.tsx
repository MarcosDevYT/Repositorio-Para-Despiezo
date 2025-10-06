import { auth } from "@/auth";
import { SubscriptionButtonCancel } from "@/components/SubscriptionButtonCancel";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { stripePlans } from "@/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import React from "react";

export default async function SubscriptionsPage() {
  const session = await auth();

  return (
    <section className="w-full space-y-16">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-center md:text-start text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Elige tu plan
            </h1>
            <p className="text-center md:text-start text-muted-foreground text-sm md:text-base">
              Mejora tu cuenta y accede a más beneficios según el tiempo que
              elijas.
            </p>
          </div>

          <Link
            className={cn(buttonVariants(), "shadow")}
            href={`https://billing.stripe.com/p/login/test_fZueVf0qC8UH4xy1sR1Fe00?prefilled_email=${session?.user.email}`}
          >
            Maneja tus Suscripciones
          </Link>
        </CardHeader>
      </Card>

      {/* Dos secciones: Gratuito + Tabs Premium */}
      <article className="grid gap-6 gap-y-16 md:grid-cols-2 max-w-2xl mx-auto place-items-center">
        {/* Plan Gratuito */}
        <Card
          className={cn(
            "relative flex flex-col border-2 shadow-sm hover:shadow-md transition-all duration-300 h-[450px] xl:h-[500px] justify-between w-full max-w-80 xl:max-w-96",
            !session?.user.pro && "border-primary"
          )}
        >
          <CardHeader className="text-center">
            <CardTitle className="font-bold text-2xl">Plan Gratuito</CardTitle>
            <CardDescription className="py-10 relative">
              <span className="text-6xl font-extrabold tracking-tight">$0</span>
              <span className="text-sm text-muted-foreground">/ mes</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Beneficios */}
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" />

                <span>
                  Publica hasta{" "}
                  <span className="font-semibold">40 productos</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-gray-400 w-4 h-4" />
                Sin acceso a kits de ventas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-gray-400 w-4 h-4" />
                Sin métricas avanzadas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-gray-400 w-4 h-4" />
                Sin dashboard exclusivo
              </li>
            </ul>

            {/* Botón */}
            {session?.user.pro && session.user.subscriptionId ? (
              <SubscriptionButtonCancel
                subscriptionId={session.user.subscriptionId}
              />
            ) : (
              <div
                className={cn(
                  buttonVariants(),
                  "w-full cursor-auto bg-blue-600 hover:bg-blue-600"
                )}
              >
                Actualmente en uso
              </div>
            )}
          </CardContent>
        </Card>

        {/* Planes Premium con Tabs */}
        <div className="flex flex-col w-full h-full items-center justify-center">
          {/* Tabs arriba de la Card */}
          <Tabs
            defaultValue={stripePlans[0].priceId}
            className="w-full relative items-center"
          >
            <TabsList className="mb-4 rounded-xl border border-border p-1 absolute -top-10 -translate-x-1/2 left-1/2 md:left-0 md:translate-0">
              {stripePlans.map((plan) => (
                <TabsTrigger
                  key={plan.priceId}
                  value={plan.priceId}
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow text-base font-medium p-2"
                >
                  {plan.duration}
                </TabsTrigger>
              ))}
            </TabsList>

            {stripePlans.map((plan) => {
              const isActive = session?.user.priceId === plan.priceId;

              // Calcular descuentos
              let discount = null;
              const base = stripePlans[0].price;

              if (plan.duration !== "1 Mes") {
                let months: number;

                if (plan.duration.includes("Año")) {
                  months = 12;
                } else {
                  months = parseInt(plan.duration);
                }

                const totalBase = base * months;
                const ahorro = totalBase - plan.price;

                if (ahorro > 0) {
                  discount = `Ahorra $${ahorro} (${Math.round((ahorro / totalBase) * 100)}%)`;
                }
              }

              return (
                <TabsContent key={plan.priceId} value={plan.priceId}>
                  <Card
                    className={cn(
                      "shadow-md hover:shadow-lg transition-all rounded-2xl h-[450px] xl:h-[500px] flex flex-col justify-between w-full max-w-80 xl:max-w-96 border-2",
                      session?.user.pro &&
                        session.user.priceId === plan.priceId &&
                        "border-primary"
                    )}
                  >
                    <CardHeader className="text-center">
                      <CardTitle className="font-bold text-2xl">
                        Plan {plan.duration}
                      </CardTitle>
                      <CardDescription>
                        Disfruta todos los beneficios premium
                      </CardDescription>

                      {/* Precio */}
                      <div className="text-center py-5">
                        <div>
                          <span className="text-6xl font-extrabold">
                            ${plan.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {plan.duration}
                          </span>
                        </div>
                        {discount && (
                          <p className="mt-2 text-green-600 font-medium">
                            {discount}
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-6 w-full">
                      {/* Beneficios Pro */}
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500 w-4 h-4" />
                          Publica productos ilimitados
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500 w-4 h-4" />
                          <span>
                            Crea{" "}
                            <span className="font-semibold">
                              Kits de ventas
                            </span>
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500 w-4 h-4" />
                          <span>
                            Accede al{" "}
                            <span className="font-semibold">
                              Panel de rendimiento
                            </span>
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="text-green-500 w-4 h-4" />
                          Dashboard exclusivo para tu negocio
                        </li>
                      </ul>

                      {/* Botón */}
                      {isActive ? (
                        <div
                          className={cn(
                            buttonVariants(),
                            "w-full cursor-auto bg-blue-600 hover:bg-blue-600 rounded-xl"
                          )}
                        >
                          Actualmente en uso
                        </div>
                      ) : (
                        <Link
                          className={cn(
                            buttonVariants(),
                            "w-full shadow-sm hover:shadow-md"
                          )}
                          href={`${plan.link}?prefilled_email=${session?.user.email}`}
                        >
                          Pagar {plan.duration}
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </article>
    </section>
  );
}
