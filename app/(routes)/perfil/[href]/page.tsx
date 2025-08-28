import { redirect } from "next/navigation";
import { getFavoriteProductsAction } from "@/actions/sell-actions";
import { ProfileEditarPerfil } from "@/components/layout/perfil/ProfileEditarPerfil";
import { ProfileCompras } from "@/components/layout/perfil/ProfileCompras";
import { ProfileFavoritos } from "@/components/layout/perfil/ProfileFavoritos";
import { ProfileConfiguracion } from "@/components/layout/perfil/ProfileConfiguracion";

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

  const products = await getFavoriteProductsAction();

  switch (href) {
    case "editar-perfil":
      return <ProfileEditarPerfil />;
    case "compras":
      return <ProfileCompras />;
    case "favoritos":
      return <ProfileFavoritos products={products} />;
    case "configuracion":
      return <ProfileConfiguracion />;
    default:
      redirect("/perfil");
  }
}
