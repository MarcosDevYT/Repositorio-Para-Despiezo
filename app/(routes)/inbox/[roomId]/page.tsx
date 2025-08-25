import { MarketplaceChat } from "@/components/chatComponents/marketplace-chat";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const session = await auth();

  return (
    <MarketplaceChat
      roomId={roomId}
      userId={session?.user.id || "0"}
      userName={session?.user.name || "Usuario"}
    />
  );
}
