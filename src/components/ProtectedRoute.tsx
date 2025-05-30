'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au montage du composant
    const checkAuth = async () => {
      try {
        // Si l'authentification est encore en cours, attendez
        if (isLoading) return;

        // Si l'utilisateur n'est pas authentifié, redirigez
        if (!isAuthenticated) {
          console.log("Utilisateur non authentifié, redirection vers login");
          router.push('/');
          return;
        }

        // Vérifier le rôle si nécessaire
        if (requiredRole && user?.role !== requiredRole) {
          console.log(`Rôle requis: ${requiredRole}, rôle utilisateur: ${user?.role}`);
          router.push('/overview');
          return;
        }

        // Authentification réussie
        setIsChecking(false);
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        router.push('/');
      }
    };

    checkAuth();
  }, [user, isLoading, isAuthenticated, router, requiredRole]);

  // Afficher un spinner pendant la vérification
  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  // Ne pas afficher le contenu si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return null;
  }

  // Ne pas afficher le contenu si l'utilisateur n'a pas le rôle requis
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}