import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = ['/', '/login', '/register']

// Routes réservées aux administrateurs
const adminRoutes = ['/admins', '/services', '/users']

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  console.log("Middleware - URL:", pathname);
  console.log("Middleware - Auth Token:", authToken ? "Présent" : "Absent");

  // Permettre l'accès aux routes publiques sans authentification
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.includes('.')) {
    console.log("Middleware - Route publique, accès autorisé");
    return NextResponse.next()
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!authToken) {
    console.log("Middleware - Aucun token, redirection vers login");
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Vérifier les routes réservées aux administrateurs
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    console.log("Middleware - Route admin détectée:", pathname);
    
    try {
      // Option 1: Utiliser l'API locale de Next.js comme proxy
      // Cela évite les problèmes CORS et de doubles lectures dans l'environnement Edge
      const apiResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `auth_token=${authToken.value}`
        }
      });
      
      console.log("Middleware - Statut réponse:", apiResponse.status);
      
      if (!apiResponse.ok) {
        console.log("Middleware - Échec de la validation utilisateur");
        throw new Error(`Échec de la validation: ${apiResponse.status}`);
      }
      
      const userData = await apiResponse.json();
      console.log("Middleware - Données utilisateur:", userData);
      
      // Vérifier si l'utilisateur est un administrateur
      if (!userData.isAuthenticated || userData.role !== 'Admin') {
        console.log("Middleware - L'utilisateur n'est pas admin, redirection vers overview");
        return NextResponse.redirect(new URL('/overview', request.url));
      }
      
      console.log("Middleware - Utilisateur admin confirmé, accès autorisé");
    } catch (error) {
      console.error('Erreur de vérification admin:', error);
      
      // En cas d'erreur, rediriger vers la page d'accueil protégée
      return NextResponse.redirect(new URL('/overview', request.url));
    }
  }

  // Permettre l'accès aux routes protégées si authentifié
  console.log("Middleware - Accès autorisé");
  return NextResponse.next();
}

// Configurer les chemins à protéger
export const config = {
  matcher: [
    '/overview/:path*',
    '/requests/:path*',
    '/donors/:path*',
    '/stock/:path*',
    '/donorpledges/:path*',
    '/admins/:path*',
    '/services/:path*',
    '/users/:path*',
  ],
}