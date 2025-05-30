// src/lib/authAPI.ts
import { AuthResponse } from '@/types/auth';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = 'http://192.168.1.245:5000';
/**
 * Login user with email and password
 * Returns the user data and token from the server
 * The token is also set in an HttpOnly cookie by the server
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  console.log('Logging in with email:', email);
  console.log('Password:', password);
  console.log('API URL:', API_URL); 
  try {
    console.log('Sending login request to:', `${API_URL}/auth/login`);
    console.log('Request body:', { email, password });
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({ email, password }),
    });
    console.log('Response received:', response);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Réponse d\'erreur complète:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData?.error || 'Invalid credentials');
      } catch (e) {
        throw new Error('Erreur d\'authentification: ' + response.status);
      }
    }

    // Utiliser text() d'abord pour déboguer
    const responseText = await response.text();
    console.log('Réponse brute:', responseText);
    
    // Puis parser en JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Erreur de parsing JSON:', e);
      throw new Error('Format de réponse invalide');
    }
    
    // IMPORTANT: Stocker le token dans localStorage si présent
    if (data.token) {
      console.log('Token reçu, stockage dans localStorage');
      localStorage.setItem('authToken', data.token);
    }

    // Ajouter ces logs pour afficher les informations utilisateur
    console.log('====== UTILISATEUR CONNECTÉ ======');
    console.log('Utilisateur:', data.user?.name || 'Inconnu');
    console.log('Email:', data.user?.email || email);
    console.log('Rôle:', data.user?.role || 'Non spécifié');
    console.log('Token présent:', !!data.token);
    console.log('================================');

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Get the current logged-in user
 * Uses the auth_token cookie that was set during login
 */
export async function getCurrentUser() {
  try {
    // Vérification si localStorage est disponible (pas dans SSR)
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (!token) {
      console.log('Aucun token trouvé dans localStorage');
      return { success: false, isAuthenticated: false };
    }
    
    console.log('Token trouvé dans localStorage, longueur:', token.length);
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Pour les cookies
    });

    console.log('getCurrentUser status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('Non authentifié (401)');
        return { success: false, isAuthenticated: false };
      }
      
      // Afficher l'erreur complète
      const errorText = await response.text();
      console.error('Erreur getCurrentUser:', errorText);
      throw new Error('Échec de récupération de l\'utilisateur');
    }

    const userData = await response.json();
    
    // Logs utilisateur connecté
    if (userData.isAuthenticated) {
      console.log('====== SESSION UTILISATEUR ======');
      console.log('Utilisateur:', userData.name || userData.user?.name || 'Inconnu');
      console.log('Email:', userData.email || userData.user?.email || 'Non spécifié');
      console.log('Rôle:', userData.role || userData.user?.role || 'Non spécifié');
      console.log('================================');
    }
    
    return userData;
  } catch (error) {
    console.error('Erreur getCurrentUser:', error);
    return { success: false, isAuthenticated: false };
  }
}

/**
 * Logout the current user
 * The server will clear the auth_token cookie
 */
export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('Pas de token à déconnecter');
      return { 
        success: true, 
        message: 'Aucune session active' 
      };
    }
    
    console.log('Déconnexion avec token:', token.substring(0, 10) + '...');
    
    // Try to communicate with the server to logout
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    // Always clear local token regardless of server response
    localStorage.removeItem('authToken');

    if (!response.ok) {
      console.warn(`Server logout failed with status: ${response.status}`);
      // Return success anyway since we've cleared local state
      return { 
        success: true, 
        message: 'Logged out locally, but server logout failed' 
      };
    }

    // If server responded with JSON
    try {
      return await response.json();
    } catch (parseError) {
      // If server didn't return valid JSON
      return { 
        success: true, 
        message: 'Logged out successfully' 
      };
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if network request fails, we still want to clear local auth
    localStorage.removeItem('authToken');
    // Return success anyway
    return { 
      success: true, 
      message: 'Logged out locally, but could not reach server' 
    };
  }
}