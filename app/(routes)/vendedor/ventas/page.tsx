import { auth } from "@/auth";
import { SalesProducts } from "@/components/layout/vendedor/SalesProducts";
import { verifySeller } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function SalesPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const isVerify = verifySeller(session);

  if (!isVerify) {
    redirect("/sell/business");
  }

  return <SalesProducts />;
}
