"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditableBusinessField } from "./EditableBusinessField";
import EmailVerificationStatus from "@/components/LoginComponents/EnviarVerificacionButton";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Tag,
  Box,
  Building2,
  Calendar,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  session: Session;
}

const businessCategories = [
  "Taller",
  "Distribuidor",
  "Repuestos Usados",
  "Repuestos Nuevos",
  "Repuestos Defectuosos",
];

export const SellBusinessUser = ({ session }: Props) => {
  // Estado local para categoría (vista inicial; los cambios se guardan desde el EditableBusinessField)
  const [category] = useState(
    session.user.bussinesCategory && session.user.bussinesCategory.length > 0
      ? session.user.bussinesCategory[0]
      : ""
  );

  const initials = (session.user.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="lg:flex-row w-full p-0 bg-white border border-gray-200 shadow-lg rounded-2xl gap-2">
      {/* HEADER CON AVATAR Y NOMBRE */}
      <CardHeader className="relative w-full lg:max-w-[360px] 2xl:max-w-sm py-8 px-6 flex flex-col items-center gap-4 text-center border-b lg:border-r lg:border-b-0">
        <div className="z-10 absolute top-2 w-full px-2 flex items-center justify-between">
          <div className="block">
            <EmailVerificationStatus session={session} />
          </div>

          {/* categoría si existe */}
          {category ? (
            <Badge className="h-max text-sm p-0.5 px-2 md:px-3 rounded-full">
              {category}
            </Badge>
          ) : null}
        </div>

        {/* Avatar */}
        <div className="relative">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-2xl font-semibold">
                {initials || <User className="w-10 h-10" />}
              </div>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger className="absolute top-0 right-0 z-10">
              <div className="rounded-full size-8 flex items-center justify-center bg-primary text-background ">
                <Zap size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Miembro Pro</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Name + business + badges */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            {session.user.name}
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {session.user.businessName ?? "Sin nombre de negocio"}
            </span>
          </div>
        </div>

        {/* Stats: productos y miembro desde */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="inline-flex items-center gap-2 text-sm text-gray-700">
            <Box className="size-4 text-gray-500" />
            <span className="font-medium">
              {session.user.products?.length ?? 0}
            </span>
            <span>productos</span>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="size-4 text-gray-400" />
            <span className="text-gray-600">
              Miembro desde{" "}
              <span className="font-medium">
                {session.user.createdAt
                  ? new Date(session.user.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </span>
          </div>
        </div>

        {/* Contact quick lines */}
        <div className="w-full mt-3 flex flex-col gap-2">
          <p className="w-full inline-flex items-center justify-center gap-2 text-sm">
            <Phone className="size-4 text-gray-500" />
            <span className="font-medium text-gray-800">
              {session.user.phoneNumber}
            </span>
          </p>

          <div className="w-full inline-flex items-center justify-center gap-2 text-sm">
            <MapPin className="size-4 text-gray-500" />
            <span className="text-gray-700">{session.user.location}</span>
          </div>
        </div>

        {/* Small actions */}
        <div className="w-full flex items-center gap-2 mt-3">
          <Button className="w-1/2" variant="outline" asChild>
            <Link href={`/perfil/editar-perfil`}>Editar perfil</Link>
          </Button>

          <Button className="w-1/2" asChild>
            <Link href={`/tienda/${session.user.id}`}>Ver tienda</Link>
          </Button>
        </div>
      </CardHeader>

      {/* Vendedor Content */}
      <CardContent className="px-6 py-10 xl:pr-12 w-full">
        <div className="mb-12">
          <h1 className="text-2xl font-bold">Tus información como vendedor</h1>
          <p className="text-muted-foreground">
            Aquí puedes ver y editar tu información como vendedor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
          {/* Nombre del negocio editable (mantenido) */}
          <div className="flex items-start gap-2">
            <Building2 className="size-5 text-gray-500" />
            <EditableBusinessField
              label="Nombre del negocio"
              value={session.user.businessName}
              type="text"
              fieldName="businessName"
            />
          </div>

          {/* Teléfono */}
          <div className="flex items-start gap-2">
            <Phone className="size-5 text-gray-500" />
            <EditableBusinessField
              label="Teléfono"
              value={session.user.phoneNumber}
              type="text"
              fieldName="phoneNumber"
            />
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-2">
            <MapPin className="size-5 text-gray-500" />
            <EditableBusinessField
              label="Ubicación"
              value={session.user.location}
              type="location"
              fieldName="location"
            />
          </div>

          {/* Categoría: USAR EditableBusinessField con type="select" y mantener tu estilo */}
          <div className="flex items-start gap-2">
            <Tag className="size-5 text-gray-500" />
            <div className="w-full">
              {/* reutilizamos EditableBusinessField en modo select */}
              <EditableBusinessField
                label="Categoría de negocio"
                value={category}
                type="select"
                fieldName="bussinesCategory"
                options={businessCategories}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1 col-span-full">
            <div className="flex items-start gap-2">
              <FileText className="size-5 text-gray-500" />
              <EditableBusinessField
                label="Descripción"
                value={session.user.description}
                type="textarea"
                fieldName="description"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
