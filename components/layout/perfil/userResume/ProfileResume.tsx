import EmailVerificationStatus from "@/components/LoginComponents/EnviarVerificacionButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Calendar,
  CheckSquare,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

/**
 * @description Componente que renderiza la informacion del perfil
 * @param user - Informacion del usuario
 * @returns Componente de informacion del perfil
 */
export const ProfileResume = ({ session }: { session: Session }) => {
  const {
    name,
    email,
    phoneNumber,
    location,
    businessName,
    phoneVerified,
    createdAt,
  } = session!.user!;

  // Normalizar campos opcionales
  const displayPhone =
    phoneNumber && phoneNumber.trim() !== ""
      ? phoneNumber
      : "Sin número de teléfono";
  const displayLocation =
    location && location.trim() !== "" ? location : "Sin ubicación";
  const displayBusiness =
    businessName && businessName.trim() !== ""
      ? businessName
      : "Sin nombre de empresa";

  return (
    <Card className="w-full h-max py-8">
      {/* Card Header */}
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">
          Informacion Personal
        </CardTitle>
        <CardDescription>
          Gestiona tu información de perfil y preferencias
        </CardDescription>

        <Button variant="outline" className="absolute right-5 top-0" asChild>
          <Link href="/perfil/editar-perfil">
            <Pencil className="size-4" />
            Editar Perfil
          </Link>
        </Button>
      </CardHeader>

      {/* Card Content */}
      <CardContent>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nombre completo */}
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Nombre completo</p>
            <p className="font-medium">{name}</p>
          </div>

          {/* Correo electrónico */}
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Correo electrónico</p>
            <div className="font-medium flex flex-wrap items-center gap-2">
              <Mail className="size-4" />
              {email}

              <EmailVerificationStatus session={session!} />
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Teléfono</p>
            <div className="font-medium flex items-center gap-2">
              <Phone className="size-4" />
              {displayPhone}
              {phoneNumber &&
                phoneNumber.trim() !== "" &&
                (phoneVerified ? (
                  <CheckSquare className="size-4" />
                ) : (
                  <Button
                    className="text-xs px-2.5 h-6 rounded-full bg-primary text-primary-foreground hover:bg-blue-500 hover:text-white"
                    variant="ghost"
                  >
                    Verificar Telefono
                  </Button>
                ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Ubicación</p>
            <div className="font-medium flex items-center gap-2">
              <MapPin className="size-4" />
              {displayLocation}
            </div>
          </div>

          {/* Nombre del negocio */}
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Nombre del negocio</p>
            <div className="font-medium flex items-center gap-2">
              <Building2 className="size-4" />
              {displayBusiness}
            </div>
          </div>

          {/* Miembro desde */}
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Miembro desde</p>
            <div className="font-medium flex items-center gap-2">
              <Calendar className="size-4" />{" "}
              {new Date(createdAt!).toLocaleDateString()}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};
