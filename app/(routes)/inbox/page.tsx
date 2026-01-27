import { MessageCircle } from "lucide-react";

export default function InboxPage() {
  return (
    <section className="min-h-full flex-1 w-full flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center h-full px-6 text-center gap-4">
        <div className="rounded-full bg-primary/10 p-6">
          <MessageCircle className="size-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Buzón de Mensajes
          </h1>
          <p className="text-base text-muted-foreground max-w-md">
            Aquí verás todas tus conversaciones con compradores y vendedores
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Selecciona un chat de la lista para comenzar o continuar una conversación
        </p>
      </div>
    </section>
  );
}
