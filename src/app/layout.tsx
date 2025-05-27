import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
    
    
}
=======
    <html lang="en" suppressHydrationWarning>
        <body>
          
            <main>
            {children}
            </main>
          
        </body>
      
    </html>
  );
}
>>>>>>> 247a3bd6cb3646546e72f54e9bbc92aabbf20746
