import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Configuración de la metadata de la aplicación
export const metadata: Metadata = {
  title: {
    default: "Despiezo",
    template: "Despiezo - %s",
  },
  description: "Plataforma de compra y venta de repuestos de vehículos",
};

// Layout principal de la aplicación
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-slate-50`}>
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <Navbar />
          {children}

          <Footer />
        </SessionProvider>

        <Toaster />
      </body>
    </html>
  );
}
