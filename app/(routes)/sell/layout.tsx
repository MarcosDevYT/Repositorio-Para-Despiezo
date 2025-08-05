import { MainContainer } from "@/components/layout/MainContainer";
import { SellNav } from "@/components/layout/sell/SellNav";

/**
 * @description Layout principal donde se renderizan los componentes de la venta
 * @param children - Componentes hijos
 * @returns Layout principal donde se renderizan los componentes de la venta
 */
export default async function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainContainer className="container mx-auto px-4 py-16 mt-20 flex flex-col gap-4">
      <SellNav />

      {children}
    </MainContainer>
  );
}
