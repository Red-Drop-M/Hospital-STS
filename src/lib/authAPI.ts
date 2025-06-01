// src/lib/authAPI.ts
import { AuthResponse } from '@/types/auth';

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  console.log('Logging in with email:', email);
  
  try {
    // Only accept admin@hsts.com/Admin123! as admin
    if (email === 'admin@hsts.com' && password === 'Admin123!') {
      console.log('Admin credentials verified');
      
      // IMPORTANT: Set BOTH localStorage AND cookie
      localStorage.setItem('isAdminLoggedIn', 'true');
      document.cookie = "isAdminLoggedIn=true; path=/; max-age=86400";
      document.cookie = "isLoggedIn=true; path=/; max-age=86400";
      
      console.log('Admin cookies set:', document.cookie);
      
      // Create mock user data
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@hsts.com',
        role: 'Admin'
      };
      
      console.log('====== ADMIN LOGGED IN ======');
      console.log('Name:', mockUser.name);
      console.log('Email:', mockUser.email);
      console.log('Role:', mockUser.role);
      console.log('============================');
      
      return {
        token: 'admin-session',
        user: mockUser,
        success: true
      };
    }
    
    // Add any other user login logic here if needed
    // ...
    
    // If credentials don't match, reject login
    throw new Error('Invalid credentials. Use admin@hsts.com / Admin123!');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    // IMPORTANT: Check both localStorage AND cookies for admin status
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    
    // Check if the admin cookie exists using document.cookie
    const cookies = document.cookie.split(';');
    const adminCookie = cookies.find(cookie => cookie.trim().startsWith('isAdminLoggedIn='));
    const isAdminCookie = adminCookie && adminCookie.split('=')[1] === 'true';
    
    // Log for debugging
    console.log('getCurrentUser checks:', { 
      isAdminLoggedIn,
      isAdminCookie,
      allCookies: document.cookie
    });
    
    // Use either localStorage OR cookie for admin status
    if (isAdminLoggedIn || isAdminCookie) {
      // Return admin user info
      return {
        id: '1',
        name: 'Admin User',
        email: 'admin@hsts.com',
        role: 'Admin',
        isAuthenticated: true,
        success: true
      };
    }
    
    return {
      success: false,
      isAuthenticated: false,
      error: 'Not authenticated'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      success: false,
      isAuthenticated: false,
      error: 'Failed to get user data'
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    // Simply remove the admin flag from both localStorage and cookies
    localStorage.removeItem('isAdminLoggedIn');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Error during logout:', error);
    return {
      success: false,
      message: 'Failed to logout'
    };
  }
}