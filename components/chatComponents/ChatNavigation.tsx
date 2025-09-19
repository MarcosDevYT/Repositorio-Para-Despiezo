"use client";

import { getChats } from "@/actions/chat-actions";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { Chat } from "@/types/chatTypes";
import { ChatList } from "./ChatList";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Session } from "next-auth";

export const ChatNavigation = ({ session }: { session: Session | null }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchChats = () => {
    startTransition(async () => {
      try {
        const res = await getChats();
        if (res.success === true) {
          setChats(res.chats);
        }
      } catch (error) {
        toast.error("Error al conseguir los chats");
      }
    });
  };

  const handleOpenSheet = () => {
    setOpen(true);
  };

  const handleOpenChange = () => {
    setOpen(!open);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Loader tipo skeleton
  const Loader = () => (
    <div className="flex flex-col animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-4 px-2 border-b border-gray-200"
        >
          <div className="min-w-10 size-10 bg-gray-200 rounded-full" />
          <div className="flex flex-col gap-2 w-full">
            <div className="w-2/3 h-3 bg-gray-200 rounded" />
            <div className="w-1/3 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Sheet Sidebar */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="p-0 bg-white gap-0">
          <SheetHeader className="border-b border-gray-200">
            <SheetTitle className="text-xl">Chats</SheetTitle>
          </SheetHeader>

          <div className="h-full w-full">
            {isPending ? (
              <Loader />
            ) : (
              <ChatList chats={chats} session={session} />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* 🔹 Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Chats</h2>

        <Button onClick={handleOpenSheet} size={"icon"} variant={"ghost"}>
          <Menu className="size-5" />
        </Button>
      </div>

      {/* 🔹 Desktop Sidebar */}
      <div className="hidden md:flex md:min-w-72 lg:min-w-80 2xl:min-w-sm max-w-sm min-h-full border-r border-gray-200 flex-col">
        {isPending ? <Loader /> : <ChatList chats={chats} session={session} />}
      </div>
    </>
  );
};
