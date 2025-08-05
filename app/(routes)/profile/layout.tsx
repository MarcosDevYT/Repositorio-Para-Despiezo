import { MainContainer } from "@/components/layout/MainContainer";
import { ProfileNav } from "@/components/layout/profile/ProfileNav";

/**
 * @description Layout principal donde se renderizan los componentes del perfil
 * @param children - Componentes hijos
 * @returns Layout principal donde se renderizan los componentes del perfil
 */
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainContainer className="container mx-auto px-4 py-16 mt-20 flex flex-col lg:flex-row gap-4">
      <ProfileNav />
      {children}
    </MainContainer>
  );
}
