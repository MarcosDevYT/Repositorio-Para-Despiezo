import { auth } from "@/auth";
import { ChatNavigation } from "@/components/chatComponents/ChatNavigation";
import { MainContainer } from "@/components/layout/MainContainer";
import { redirect } from "next/navigation";

/**
 * @description Layout principal donde se renderizan los componentes de los productos
 * @param children - Componentes hijos
 * @returns Layout principal donde se renderizan los componentes de los productos
 */
export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return (
    <MainContainer className="flex-col md:flex-row flex min-h-[82.5vh] max-h-[82.5vh]">
      <ChatNavigation session={session} />
      {children}
    </MainContainer>
  );
}
