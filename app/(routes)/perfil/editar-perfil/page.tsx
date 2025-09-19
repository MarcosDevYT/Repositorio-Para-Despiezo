import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { ButtonBack } from "@/components/ButtonBack";
import { EditImageProfile } from "@/components/layout/perfil/userResume/EditImageProfile";
import { EditProfileForm } from "@/components/layout/perfil/userResume/EditProfileForm";

export default async function EditarPerfilPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Card className="w-full h-fit">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">Editar Perfil</CardTitle>
        <CardDescription>
          Aquí puedes editar tu perfil y tus datos personales.
        </CardDescription>

        <ButtonBack className="top-0 right-5" />
      </CardHeader>

      <CardContent>
        <EditImageProfile image={session.user?.image ?? null} />
        <EditProfileForm user={session.user} />
      </CardContent>
    </Card>
  );
}
