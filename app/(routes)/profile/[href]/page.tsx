import { ProfileCompras } from "@/components/layout/profile/ProfileCompras";
import { ProfileConfiguracion } from "@/components/layout/profile/ProfileConfiguracion";
import { ProfileFavoritos } from "@/components/layout/profile/ProfileFavoritos";
import { ProfileEditarPerfil } from "@/components/layout/profile/ProfileEditarPerfil";
import { redirect } from "next/navigation";

/**
 * @description Pagina de perfil del usuario
 * @param params - Parametros de la ruta
 * @returns Devolvemos la ruta que pide el usuario en base al parametro
 */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ href: string }>;
}) {
  const { href } = await params;

  switch (href) {
    case "edit-profile":
      return <ProfileEditarPerfil />;
    case "shoppings":
      return <ProfileCompras />;
    case "favorites":
      return <ProfileFavoritos />;
    case "settings":
      return <ProfileConfiguracion />;
    default:
      redirect("/profile");
  }
}
