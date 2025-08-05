import { auth } from "@/auth";
import { RealtimeChat } from "@/components/realtime-chat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="w-full h-full flex min-h-[calc(100vh-9.3rem)]">
      <article className="max-w-xs w-full border-r">
        {Array.from({ length: 6 }).map((_, index) => (
          <Fragment key={index}>
            <div className="flex flex-col gap-2 p-4 cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <div className="min-w-10 size-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Filtro de Aire K&N Performance - Tsuru 2017-2020
                  </p>
                </div>
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </article>

      <div className="flex-1 w-full">
        <RealtimeChat roomName="my-chat-room" username={session?.user?.name!} />
      </div>
    </section>
  );
}
