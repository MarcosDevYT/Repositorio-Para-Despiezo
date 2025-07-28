import { LoginButton } from "@/components/LoginButton";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <LoginButton />
      </Card>
    </div>
  );
}
