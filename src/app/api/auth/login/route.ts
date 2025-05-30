// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const { email, password } = await request.json();
  
//   // Vérification des identifiants
//   if ((email === 'admin@example.com' && password === 'admin123') || 
//       (email === 'user@example.com' && password === 'user123')) {
    
//     // Déterminer le rôle en fonction de l'email
//     const isAdmin = email === 'admin@example.com';
//     const userId = isAdmin ? '1' : '2';
//     const role = isAdmin ? 'Admin' : 'User';
//     const name = isAdmin ? 'Admin User' : 'Regular User';
    
//     // Créer un token JWT simulé
//     const token = `fake-jwt-token-${role.toLowerCase()}-${Date.now()}`;
    
//     // Réponse avec cookie HTTP only
//     const response = NextResponse.json({
//       token,
//       user: {
//         id: userId,
//         name,
//         email,
//         role
//       },
//       success: true
//     });
    
//     // Définir le cookie auth_token exactement comme votre backend
//     response.cookies.set({
//       name: 'auth_token',
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60, // 7 jours
//       path: '/',
//       sameSite: 'strict'
//     });
    
//     return response;
//   } else {
//     return NextResponse.json(
//       { success: false, error: 'Invalid credentials' },
//       { status: 401 }
//     );
//   }
// }