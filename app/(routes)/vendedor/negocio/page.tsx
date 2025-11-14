import { auth } from "@/auth";
import { SellBusinessUser } from "@/components/layout/vendedor/negocio/SellBusinessUser";
import { SellBusinessVerify } from "@/components/layout/vendedor/negocio/SellBusinessVerify";

import { verifySeller } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function SellBusinessPage() {
  // Verificamos que el usuario este logeado
  const session = await auth();

  if (!session?.user) redirect("/login");

  const isVerify = verifySeller(session);

  if (isVerify) {
    return <SellBusinessUser session={session} />;
  } else {
    return <SellBusinessVerify session={session} />;
  }
}
