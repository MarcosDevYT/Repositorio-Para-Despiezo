import { auth } from "@/auth";
import { ProfileConfiguracion } from "@/components/layout/perfil/ProfileConfiguracion";
import { redirect } from "next/navigation";

import React from "react";

export default async function ConfigurationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <ProfileConfiguracion session={session} />;
}
