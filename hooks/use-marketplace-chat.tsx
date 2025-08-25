"use client";

import { getChatRoomAction } from "@/actions/chat-actions";
import { createClient } from "@/lib/client";
import {
  ChatRoom,
  MarketplaceChatMessage,
  UseMarketplaceChatProps,
} from "@/types/chatTypes";
import { useCallback, useEffect, useState, useTransition } from "react";

const EVENT_MESSAGE_TYPE = "new_message";

export function useMarketplaceChat({
  roomId,
  userId,
}: UseMarketplaceChatProps) {
  const supabase = createClient();

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<MarketplaceChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Funcion para obtener el ChatRoom
  const loadChatRoom = () => {
    startTransition(async () => {
      try {
        const res = await getChatRoomAction(roomId);
        if (res.success === true) {
          const roomData = res.room;
          setRoom(roomData);
          setMessages(roomData.messages || []);
        }
      } catch (error) {
        console.error("Error loading room:", error);
      }
    });
  };

  // Cargar datos iniciales del chat
  useEffect(() => {
    if (roomId) {
      loadChatRoom();
    }
  }, [roomId]);

  // Configurar canal de realtime
  useEffect(() => {
    if (!roomId) return;

    const newChannel = supabase.channel(`room:${roomId}`);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const newMessage = payload.payload as MarketplaceChatMessage;
        // Solo agregar el mensaje si no es del usuario actual (evitar duplicados)
        if (newMessage.senderId !== userId) {
          setMessages((current) => [...current, newMessage]);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomId, userId, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected || !roomId) return;

      try {
        // Guardar en base de datos
        const response = await fetch("/api/chat/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId,
            content,
          }),
        });

        if (response.ok) {
          const savedMessage = await response.json();

          // Actualizar estado local inmediatamente
          setMessages((current) => [...current, savedMessage]);

          // Enviar a través de realtime para otros usuarios
          await channel.send({
            type: "broadcast",
            event: EVENT_MESSAGE_TYPE,
            payload: savedMessage,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [channel, isConnected, roomId]
  );

  return {
    room,
    messages,
    sendMessage,
    isConnected,
    isPending,
  };
}
