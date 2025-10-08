import { auth } from "@/auth";
import { Categories } from "@/components/layout/Categories/Categories";
import { MainContainer } from "@/components/layout/MainContainer";

/**
 * @description Layout principal donde se renderizan los componentes de los productos
 * @param children - Componentes hijos
 * @returns Layout principal donde se renderizan los componentes de los productos
 */
export default async function KitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <MainContainer>
      <div className="border-b bg-blue-50 px-4 lg:px-12 py-4 w-full">
        <Categories userId={session?.user.id} />
      </div>

      <div className="container mx-auto px-4 py-16">{children}</div>
    </MainContainer>
  );
}
