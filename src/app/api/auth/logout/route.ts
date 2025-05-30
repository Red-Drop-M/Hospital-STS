import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
  
  // Supprimer le cookie d'authentification
  response.cookies.set({
    name: 'auth_token',
    value: '',
    expires: new Date(0),
    path: '/'
  });
  
  return response;
}