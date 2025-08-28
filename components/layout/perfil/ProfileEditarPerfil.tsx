import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { EditImageProfile } from "./userResume/EditImageProfile";
import { ButtonBack } from "@/components/ButtonBack";
import { EditProfileForm } from "./userResume/EditProfileForm";

export const ProfileEditarPerfil = async () => {
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
};
