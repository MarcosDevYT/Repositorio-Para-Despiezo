import { useCallback, useRef } from "react";

// Funcion para hacer el scrool automatico del chat
export function useChatScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return { containerRef, scrollToBottom };
}
