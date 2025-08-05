import { auth } from "@/auth";
import { ProfileCards } from "@/components/layout/profile/ProfileCards";
import { ProfileResume } from "@/components/layout/profile/userResume/ProfileResume";

/**
 * @description Layout principal donde se renderizan los componentes del perfil
 * @see ProfileResume - Componente que renderiza la informacion del perfil
 * @see ProfileCards - Componente que renderiza las cards con las estadisticas del usuario
 * @returns Pagina de perfil de usuario
 */
export default async function ProfilePage() {
  const session = await auth();

  console.log(session);

  const { user } = session!;

  return (
    <div className="flex flex-col gap-6 w-full">
      <ProfileResume user={user} />

      <ProfileCards />
    </div>
  );
}
