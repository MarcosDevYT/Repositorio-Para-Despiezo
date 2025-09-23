import { OCRgpt } from "@/components/OCRgpt";
import { SearchForOEM } from "@/components/searchComponents/SearchForOEM";

export const ToolsSection = () => {
  return (
    <section className="py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Herramientas de Búsqueda</h2>
        <p className="text-muted-foreground">
          Encuentra partes específicas con nuestras herramientas avanzadas
        </p>
      </div>

      <div className="grid md:grid-cols-2 justify-center gap-6 max-w-4xl mx-auto">
        {/* OEM Search Tool */}
        <SearchForOEM />
        {/* OCR Scanner Tool */}
        <OCRgpt />
      </div>
    </section>
  );
};
