import { Chat } from "@/types/chatTypes";
import { Badge } from "../ui/badge";
import { Session } from "next-auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const ChatList = ({
  chats,
  session,
}: {
  chats: Chat[];
  session: Session | null;
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          No tienes conversaciones aún
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Empieza contactando a un vendedor desde un producto
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {chats.map((chat) => {
        const userId = session?.user?.id;

        let roleLabel = "";
        let nameLabel = "";

        if (userId === chat.vendor.id) {
          roleLabel = "Comprador";
          nameLabel = chat.buyer.name ?? chat.buyer.email;
        } else if (userId === chat.buyer.id) {
          roleLabel = "Vendedor";
          nameLabel = chat.vendor.name ?? chat.vendor.email;
        } else {
          roleLabel = "Vendedor";
          nameLabel = chat.vendor.name ?? chat.vendor.email;
        }

        const lastMessage = chat.messages?.[0];
        const isLastMessageFromMe = lastMessage?.senderId === userId;

        return (
          <Link
            href={`/inbox/${chat.id}`}
            key={chat.id}
            className="flex flex-row items-start gap-3 py-4 px-3 hover:bg-muted/50 cursor-pointer border-b transition-colors"
          >
            <div className="min-w-10 size-10 bg-gray-200 rounded-full overflow-clip flex items-center justify-center flex-shrink-0">
              <img
                src={chat.product.images[0]}
                alt={chat.product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-sm line-clamp-1">
                  {chat.product.name}
                </span>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(lastMessage.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs">
                  {roleLabel}
                </Badge>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {nameLabel}
                </span>
              </div>
              {lastMessage && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {isLastMessageFromMe && "Tú: "}
                  {lastMessage.content}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
