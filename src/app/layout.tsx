import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuestionsProvider } from "@/contexts/QuestionsContext"; // Importe o novo contexto
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "QRious",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <AuthProvider>
        <QuestionsProvider>
          <body>
            <Toaster />
            {children}
          </body>
        </QuestionsProvider>
      </AuthProvider>
    </html>
  );
}
