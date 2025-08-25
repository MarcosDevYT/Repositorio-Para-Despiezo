import { Chat } from "@/types/chatTypes";
import { Badge } from "../ui/badge";
import { Session } from "next-auth";
import Link from "next/link";

export const ChatList = ({
  chats,
  session,
}: {
  chats: Chat[];
  session: Session | null;
}) => (
  <div className="flex flex-col">
    {chats.map((chat) => {
      const userId = session?.user?.id;

      let roleLabel = "";
      let nameLabel = "";

      if (userId === chat.vendor.id) {
        // Usuario es el vendedor → mostrar comprador
        roleLabel = "Comprador";
        nameLabel = chat.buyer.name ?? chat.buyer.email;
      } else if (userId === chat.buyer.id) {
        // Usuario es el comprador → mostrar vendedor
        roleLabel = "Vendedor";
        nameLabel = chat.vendor.name ?? chat.vendor.email;
      } else {
        // fallback raro (no debería pasar)
        roleLabel = "Vendedor";
        nameLabel = chat.vendor.name ?? chat.vendor.email;
      }

      return (
        <Link
          href={`/inbox/${chat.id}`}
          key={chat.id}
          className="flex flex-row items-center gap-3 py-4 px-2 hover:bg-gray-100 cursor-pointer border-b transition max-h-18"
        >
          <div className="min-w-10 size-10 bg-gray-200 rounded-full overflow-clip flex items-center justify-center">
            <img
              src={chat.product.images[0]}
              alt={chat.product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base line-clamp-1">
              {chat.product.name}
            </span>
            <div className="flex items-center gap-2">
              <Badge>{roleLabel}</Badge>
              <span className="text-xs text-gray-500">{nameLabel}</span>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
);
