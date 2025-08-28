import { auth } from "@/auth";
import { ProfileCards } from "@/components/layout/perfil/ProfileCards";
import { ProfileResume } from "@/components/layout/perfil/userResume/ProfileResume";

/**
 * @description Layout principal donde se renderizan los componentes del perfil
 * @see ProfileResume - Componente que renderiza la informacion del perfil
 * @see ProfileCards - Componente que renderiza las cards con las estadisticas del usuario
 * @returns Pagina de perfil de usuario
 */
export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return <div>No session</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <ProfileResume session={session} />

      <ProfileCards session={session} />
    </div>
  );
}
