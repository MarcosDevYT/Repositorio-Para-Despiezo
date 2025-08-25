import { type MarketplaceChatMessage } from "@/hooks/use-marketplace-chat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: MarketplaceChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
}

export const MessageItem = ({
  message,
  isOwnMessage,
  showHeader,
}: MessageItemProps) => {
  return (
    <div
      className={`flex mt-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={cn("max-w-[75%] w-fit flex flex-col gap-1", {
          "items-end": isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 text-xs px-3", {
              "justify-end flex-row-reverse": isOwnMessage,
            })}
          >
            <span className={"font-medium"}>{message.sender.name}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            "py-2 px-3 rounded-xl text-sm w-fit",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
