import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Vérifier si le cookie auth_token existe
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('auth_token');
  
  if (!authToken) {
    return NextResponse.json(
      { success: false, isAuthenticated: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // Déterminer le rôle à partir du token (dans un cas réel, vous décoderiez le JWT)
  const isAdmin = authToken.value.includes('admin');
  
  return NextResponse.json({
    id: isAdmin ? '1' : '2',
    name: isAdmin ? 'Admin User' : 'Regular User',
    email: isAdmin ? 'admin@example.com' : 'user@example.com',
    role: isAdmin ? 'Admin' : 'User',
    isAuthenticated: true,
    success: true
  });
}