"use client";

import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/header";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-500">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 h-16 flex justify-between items-center gap-4 border-b bg-background px-6 md:gap-6">
              <Header />
            </header>
            <main>
              {isClient ? children : <div>Loading...</div>}
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}