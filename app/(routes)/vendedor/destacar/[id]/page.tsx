import { getProductByIdAction } from "@/actions/sell-actions";
import { auth } from "@/auth";
import { DestacarProductIndex } from "@/components/layout/vendedor/SalesDestacarId";
import { redirect } from "next/navigation";

export default async function DestacarIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user) redirect("/login");

  const product = await getProductByIdAction(id);

  if (!product || "error" in product || product.vendorId !== session?.user.id) {
    return redirect("/");
  }

  return <DestacarProductIndex product={product} />;
}
