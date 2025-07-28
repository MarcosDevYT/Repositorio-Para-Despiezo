import { signOut } from "@/auth";
import { Button } from "./ui/button";

export async function LogOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">Signout</Button>
    </form>
  );
}
