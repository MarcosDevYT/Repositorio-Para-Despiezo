import { MainContainer } from "@/components/layout/MainContainer";

/**
 * @description Layout principal donde se renderizan los componentes de los productos
 * @param children - Componentes hijos
 * @returns Layout principal donde se renderizan los componentes de los productos
 */
export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainContainer className="container mx-auto px-4 py-16 mt-20">
      {children}
    </MainContainer>
  );
}
