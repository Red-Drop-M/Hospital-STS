// src/types/auth.ts
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  success: boolean;
}

export interface GetCurrentUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
  success: boolean;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  success: boolean;
}