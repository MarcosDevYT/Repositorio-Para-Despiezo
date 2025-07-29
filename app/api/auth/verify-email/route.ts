import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ error: "No se encontró el token" }, { status: 400 });
  }

  // Verificar si existe el token en la base de datos
  const verifyToken = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!verifyToken) {
    return new Response("No se encontró el token", { status: 400 });
  }

  // Verificar si el token ha expirado
  if (verifyToken.expires < new Date()) {
    return new Response("Token expirado", { status: 400 });
  }

  // Verificar si el email esta verificado
  const user = await prisma.user.findUnique({
    where: {
      email: verifyToken.identifier,
    }
  })

  if (user?.emailVerified) {
    return new Response("Email ya verificado", { status: 400 });
  }

  // Marcar el email como verificado
  await prisma.user.update({
    where: {
      email: verifyToken.identifier,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  // Return Response.json({ token })
  redirect("/login?verified=true");
}