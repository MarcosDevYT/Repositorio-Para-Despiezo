import { ChatNavigation } from "@/components/chatComponents/ChatNavigation";
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
    <MainContainer className="flex-col md:flex-row flex min-h-[82.5vh] max-h-[82.5vh]">
      <ChatNavigation />
      {children}
    </MainContainer>
  );
}
