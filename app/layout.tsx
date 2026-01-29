import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Configuración de la metadata de la aplicación
export const metadata: Metadata = {
  title: {
    default: "Despiezo",
    template: "Despiezo - %s"
  },
  description: "Plataforma de compra y venta de repuestos de vehículos",
};

// Layout principal de la aplicación
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-slate-50`}>
        <SessionProvider>
          <Navbar />
          {children}

          <Footer />
        </SessionProvider>

        <Toaster />
      </body>
    </html>
  );
}
