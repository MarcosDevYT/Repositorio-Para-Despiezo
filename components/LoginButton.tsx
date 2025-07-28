import { signIn } from "@/auth";
import { Button } from "./ui/button";

export async function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button className="w-full rounded-full h-12 text-lg" type="submit">
        Signin with Google
      </Button>
    </form>
  );
}
