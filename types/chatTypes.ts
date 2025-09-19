import { ProductType } from "./ProductTypes";

export interface UseMarketplaceChatProps {
  roomId?: string;
  userId?: string;
}

export interface MarketplaceChatMessage {
  roomId: string;
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  productId: string;
  product: ProductType;
  vendor: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  messages: MarketplaceChatMessage[];
}

// Tipado para chatList
export interface Chat {
  id: string;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  vendor: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  buyer: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}
