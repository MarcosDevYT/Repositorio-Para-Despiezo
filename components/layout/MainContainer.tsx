import { Footer } from "./Footer";
import { Navbar } from "./navbar/Navbar";

/**
 * @description Contenedor principal de la aplicacion
 * @param children - Componentes hijos
 * @param className - Clases de CSS para el contenedor
 * @returns Contenedor principal de la aplicacion
 */
export const MainContainer = ({
  children,
  params,
  className,
}: {
  children: React.ReactNode;
  params: string;
  className?: string;
}) => {
  return (
    <>
      <Navbar params={params} />
      <main className={`${className}`}>{children}</main>
      <Footer />
    </>
  );
};
