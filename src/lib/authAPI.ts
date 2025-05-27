// src/lib/authAPI.ts
import { AuthResponse, CurrentUserResponse } from '@/types/auth';

const API_URL = 'http://localhost:3001';

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Attempting login to:', `${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      console.log('Token stored in localStorage');
    }

    return data;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    console.log('Getting current user with token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Current user response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get current user');
    }

    return data;
  } catch (error) {
    console.error('Get current user error details:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    // Clear token from localStorage
    localStorage.removeItem('auth_token');

    return data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};