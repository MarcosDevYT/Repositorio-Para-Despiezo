import { auth } from "@/auth";
import { SellProducts } from "@/components/layout/vendedor/SellProducts";
import { redirect } from "next/navigation";

export default async function SellPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return <SellProducts />;
}
