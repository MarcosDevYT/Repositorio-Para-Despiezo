import { auth } from "@/auth";
import { MainContainer } from "@/components/layout/MainContainer";
import { SellNav } from "@/components/layout/vendedor/SellNav";
import { VendedorEmailAlert } from "@/components/layout/vendedor/VendedorEmailAlert";

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

  const productCount = session?.user?.products?.length ?? 0;
  const emailVerified = !!session?.user?.emailVerified;
  const showEmailAlert = productCount >= 1 && !emailVerified;

  return (
    <MainContainer className="container mx-auto px-4 py-8 md:py-16 flex flex-col gap-4 min-h-[82.5vh]">
      <SellNav session={session} />

      {showEmailAlert && session && (
        <VendedorEmailAlert session={session} />
      )}

      {children}
    </MainContainer>
  );
}
