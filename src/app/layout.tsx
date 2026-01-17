// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google"; // <--- Trocamos para Poppins
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// Configuração da Fonte Poppins
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Pesos mais usados
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cardapiocerto.com.br'),
  title: "Cardápio Certo - Seu Pedido Digital",
  description: "Crie seu Cardápio personalizado e compartilhe com seus Clientes.",
  manifest: "/manifest.json",
  icons: {
    icon: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cardápio Certo",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}