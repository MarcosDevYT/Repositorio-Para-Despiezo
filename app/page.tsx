import { auth } from "@/auth";
import { LogOutButton } from "@/components/LogOutButton";
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

      {session?.user ? (
        <LogOutButton />
      ) : (
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
