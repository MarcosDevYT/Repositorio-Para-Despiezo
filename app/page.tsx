import { auth } from "@/auth";
import EmailVerificationStatus from "@/components/LoginComponents/EnviarVerificacionButton";
import { LogOutButton } from "@/components/LoginComponents/LogOutButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <p>
        {session
          ? `Estas logeado como ${session.user?.name}`
          : "No estas logeado"}
      </p>

      <div className="my-4">
        <p>Datos de la session:</p>

        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      {session?.user ? (
        <LogOutButton />
      ) : (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}

      <EmailVerificationStatus email={session?.user?.email ?? ""} />
    </div>
  );
}
