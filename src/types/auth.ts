// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  success: boolean;
}

export interface CurrentUserResponse extends User {
  isAuthenticated: boolean;
  success: boolean;
  error?: string | null;
}