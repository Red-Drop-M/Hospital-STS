"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function AuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Ne pas afficher sur la page de connexion
  if (pathname === "/login") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-background border rounded-md shadow-md p-3 flex items-center space-x-2">
        <LoadingSpinner className="h-4 w-4" />
        <span className="text-sm">Vérification de l'authentification...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-md shadow-md p-3 flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <span className="text-sm text-red-700">Non authentifié</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-md shadow-md p-3 flex items-center space-x-2">
      <div className="h-2 w-2 rounded-full bg-green-500"></div>
      <span className="text-sm text-green-700">
        Connecté en tant que {user?.name} ({user?.role})
      </span>
    </div>
  );
}
export default AuthStatus;