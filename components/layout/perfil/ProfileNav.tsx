import { auth } from "@/auth";
import { ProfileLinks } from "@/components/ProfileLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

  const displayBusiness =
    businessName && businessName.trim() !== "" ? businessName : "";

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

        <p className="text-lg text-muted-foreground">{displayBusiness}</p>

        <div className="flex items-center gap-1">
          <Star className="size-4 text-yellow-500" fill="currentColor" />
          <p className="text-base">
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground"> (123 reseñas)</span>
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 my-4">
          {/* categoría si existe */}
          {user.bussinesCategory ? (
            <Badge className="h-max text-sm p-0.5 px-2 md:px-3 rounded-full">
              {user.bussinesCategory}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      {/* Card Content con los links de navegacion */}
      <CardContent>
        <ProfileLinks />
      </CardContent>
    </Card>
  );
};
