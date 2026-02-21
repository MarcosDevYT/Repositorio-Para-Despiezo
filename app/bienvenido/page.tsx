import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PostRegistrationWizard } from "@/components/layout/wizard/PostRegistrationWizard";

export default async function BienvenidoPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return <PostRegistrationWizard userName={session.user.name || "Usuario"} />;
}
