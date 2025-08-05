import { auth } from "@/auth";
import { ProfileLinks } from "@/components/ProfileLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User } from "lucide-react";

/**
 * @description Componente de navegacion para el perfil del usuario
 * @returns Componente de navegacion
 * @see ProfileLinks - Componente que renderiza los links del perfil
 */
export const ProfileNav = async () => {
  const session = await auth();

  const { user } = session!;
  const { name, businessName, image } = user!;

  const slicedName = name?.slice(0, 2);

  return (
    <Card className="w-full h-fit lg:max-w-sm">
      {/* Card Header con la informacion del usuario */}
      <CardHeader className="flex flex-col items-center justify-center">
        <Avatar className="size-20 mb-4">
          <AvatarImage className="object-cover" src={image ?? ""} />
          <AvatarFallback className="size-full text-xl uppercase">
            {slicedName ?? <User className="size-full" />}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-2xl font-bold">{name}</CardTitle>

        <p className="text-lg text-muted-foreground">
          {businessName ?? "Nombre de Empresa"}
        </p>

        <div className="flex items-center gap-1">
          <Star className="size-4 text-yellow-500" fill="currentColor" />
          <p className="text-base">
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground"> (123 reseñas)</span>
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 my-4">
          <span className="text-sm bg-blue-500 rounded-full px-3 py-1 text-white">
            Taller
          </span>
          <span className="text-sm bg-green-500 rounded-full px-3 py-1 text-white">
            Reparación
          </span>
        </div>
      </CardHeader>

      {/* Card Content con los links de navegacion */}
      <CardContent>
        <ProfileLinks />
      </CardContent>
    </Card>
  );
};
