import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 h-16 flex justify-between items-center gap-4 border-b bg-background px-6 md:gap-6">
              <Header/>
            </header>
            <main>
              {children}
            </main>
          </div>
        
  );
}