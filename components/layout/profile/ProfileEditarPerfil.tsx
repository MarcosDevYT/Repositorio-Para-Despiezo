import { auth } from "@/auth";
import { EditProfileForm } from "@/components/layout/profile/userResume/EditProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditImageProfile } from "./userResume/EditImageProfile";

export const ProfileEditarPerfil = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Editar Perfil</CardTitle>

        <CardDescription>
          Aquí puedes editar tu perfil y tus datos personales.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <EditImageProfile image={user?.image ?? null} />
        <EditProfileForm user={user} />
      </CardContent>
    </Card>
  );
};
