/**
 * @description Contenedor principal de la aplicacion
 * @param children - Componentes hijos
 * @param className - Clases de CSS para el contenedor
 * @returns Contenedor principal de la aplicacion
 */
export const MainContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <main className={`${className}`}>{children}</main>;
};
