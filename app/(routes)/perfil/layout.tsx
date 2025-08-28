import { auth } from "@/auth";
import { MainContainer } from "@/components/layout/MainContainer";
import { ProfileNav } from "@/components/layout/perfil/ProfileNav";
import { redirect } from "next/navigation";

/**
 * @description Layout principal donde se renderizan los componentes del perfil
 * @param children - Componentes hijos
 * @returns Layout principal donde se renderizan los componentes del perfil
 */
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return (
    <MainContainer
      params="products"
      className="container mx-auto px-4 py-16 min-h-[82.5vh] flex flex-col lg:flex-row gap-4"
    >
      <ProfileNav />
      {children}
    </MainContainer>
  );
}
