import { getUserOrdens } from "@/actions/order-actions";
import { auth } from "@/auth";
import { Card, CardHeader } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { ComprasCard } from "@/components/layout/ordenesLayout/ComprasCard";
import { groupOrdersByYearMonth } from "@/lib/utils";
import { monthNames } from "@/lib/constants/conts";

export default async function ComprasPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const ordenes = await getUserOrdens(session.user.id);
  const groupedOrders = groupOrdersByYearMonth(ordenes);

  return (
    <div className="flex flex-col items-start justify-start space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="text-center md:text-start w-full">
            <h1 className="text-3xl font-bold">Mis Compras</h1>
            <p className="font-normal text-gray-600">
              Aquí puedes gestionar tus ordenes de productos y su detalle
            </p>
          </div>
        </CardHeader>
      </Card>

      {ordenes.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <h2 className="text-xl font-semibold">Aún no tienes compras</h2>
          <p className="text-gray-600">
            Cuando compres productos o kits, aparecerán aquí.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-row gap-4 h-full w-full px-4">
            <div className="flex p-0.5 min-h-full bg-primary rounded-2xl" />

            {Object.entries(groupedOrders)
              .sort(
                ([yearA], [yearB]) =>
                  Number.parseInt(yearB) - Number.parseInt(yearA)
              )
              .map(([year, months]) => (
                <div key={year} className="w-full">
                  {/* Year title at top */}
                  <div className="mb-8 relative">
                    <h2 className="text-3xl font-bold text-foreground">
                      {year}
                    </h2>

                    <div className="absolute flex size-5 rounded-full bg-white border-3 border-primary top-1.5 -left-[28px]" />
                  </div>

                  {Object.entries(months)
                    .sort(
                      ([monthA], [monthB]) =>
                        Number.parseInt(monthB) - Number.parseInt(monthA)
                    )
                    .map(([month, monthOrders]) => {
                      const monthIndex = Number.parseInt(month);
                      const monthName = monthNames[monthIndex];

                      return (
                        <div key={`${year}-${month}`} className="mb-10">
                          <h3 className="text-xl font-semibold text-foreground mb-4">
                            {monthName}
                          </h3>

                          <div className="space-y-3">
                            {monthOrders.map((orden) => (
                              <ComprasCard key={orden.id} orden={orden} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
