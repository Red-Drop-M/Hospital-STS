import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RED-DROP",
  description: "Blood Bank Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <main>
            {children}
          </main>
          <Toaster />
          {/* Le composant AuthStatus est importé ici dynamiquement pour éviter les erreurs d'hydratation */}
          {/* puisqu'il utilise useAuth qui doit être utilisé dans un AuthProvider */}
          <div suppressHydrationWarning>
            {process.browser && (
              <div id="auth-status-container" suppressHydrationWarning />
            )}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}