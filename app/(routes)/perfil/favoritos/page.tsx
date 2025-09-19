import { redirect } from "next/navigation";
import { getFavoriteProductsAction } from "@/actions/sell-actions";
import { ProfileFavoritos } from "@/components/layout/perfil/ProfileFavoritos";
import { auth } from "@/auth";

export default async function FavoritosPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const products = await getFavoriteProductsAction();

  return <ProfileFavoritos products={products} />;
}
