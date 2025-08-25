"use client";

import { cn } from "@/lib/utils";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useMarketplaceChat } from "@/hooks/use-marketplace-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessagesSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MessageItem } from "./MessageItem";
import Link from "next/link";
import { ChatProductDetails } from "../layout/ProductComponents/ChatProductDetails";

interface MarketplaceChatProps {
  roomId: string;
  userId: string;
  userName: string;
}

export const MarketplaceChat = ({
  roomId,
  userId,
  userName,
}: MarketplaceChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll();

  // Llamamos al useMarketPlaceChat
  const { room, messages, sendMessage, isConnected, isPending } =
    useMarketplaceChat({
      roomId,
      userId,
      userName,
    });

  // Setear nuevos mensajes
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Callback para enviar mensajes
  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      sendMessage(newMessage);
      setNewMessage("");
    },
    [newMessage, isConnected, sendMessage]
  );

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-full w-full">
        <div className="text-center flex flex-col items-center justify-center animate-pulse text-blue-500">
          <MessagesSquare className="size-12 my-2" />
          <p className="text-base">Cargando chat</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-full w-full">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Chat no encontrado</p>
        </div>
      </div>
    );
  }

  const otherUser = room.vendor.id === userId ? room.buyer : room.vendor;
  const isVendor = room.vendor.id === userId;

  return (
    <div className="flex flex-1 min-h-full w-full bg-background text-foreground antialiased">
      <div className="flex flex-col flex-1 min-h-full w-full">
        {/* Header */}
        <header className="border-b border-border p-4 h-18">
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden min-w-10 size-10 bg-muted">
              <img src={otherUser.image} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{otherUser.name}</h2>

                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {isVendor ? "Comprador" : "Vendedor"}
                </span>
              </div>
              <Link
                href={`/products/${room.product.id}`}
                className="text-sm text-muted-foreground line-clamp-1"
              >
                Producto: {room.product.name}
              </Link>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No hay mensajes aún. ¡Inicia la conversación!
            </div>
          ) : null}
          <div className="space-y-1">
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showHeader =
                !prevMessage || prevMessage.senderId !== message.senderId;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <MessageItem
                    message={message}
                    isOwnMessage={message.senderId === userId}
                    showHeader={showHeader}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 border-t border-border p-4"
        >
          <Input
            className={cn(
              "rounded-full bg-background text-sm transition-all duration-300 h-10",
              isConnected && newMessage.trim()
                ? "w-[calc(100%-36px)]"
                : "w-full"
            )}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={!isConnected}
          />
          {isConnected && newMessage.trim() && (
            <Button
              className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300 size-10 flex items-center justify-center"
              type="submit"
              disabled={!isConnected}
            >
              <Send className="size-5 mr-0.5 mt-0.5" />
            </Button>
          )}
        </form>
      </div>
      {/* Product details */}
      <ChatProductDetails product={room.product} />
    </div>
  );
};
