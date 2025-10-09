import { auth } from "@/auth";
import { MainContainer } from "@/components/layout/MainContainer";
import { SellNav } from "@/components/layout/vendedor/SellNav";

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
  const session = await auth();

  return (
    <MainContainer className="container mx-auto px-4 py-8 md:py-16 flex flex-col gap-4 min-h-[82.5vh]">
      <SellNav session={session} />

      {children}
    </MainContainer>
  );
}
