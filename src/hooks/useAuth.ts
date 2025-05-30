// src/hooks/useAuth.ts
// Import the useAuth hook directly from AuthContext instead
// This file is just a re-export for convenience
import { useAuth as useAuthFromContext } from '@/contexts/AuthContext';

export const useAuth = useAuthFromContext;