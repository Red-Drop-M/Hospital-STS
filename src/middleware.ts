import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register']

// Admin routes
const adminRoutes = ['/admins', '/services', '/users']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log("Middleware - URL:", pathname);

  // Allow access to public routes without authentication
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.includes('.')) {
    console.log("Middleware - Public route, access allowed");
    return NextResponse.next()
  }

  // Check for both regular login and admin status
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const isAdmin = request.cookies.get('isAdminLoggedIn')?.value === 'true'
  
  console.log("Middleware - Is logged in:", isLoggedIn ? "Yes" : "No");
  console.log("Middleware - Is admin:", isAdmin ? "Yes" : "No");

  // Redirect to login page if not authenticated
  if (!isLoggedIn && !isAdmin) {
    console.log("Middleware - Not logged in, redirecting to login");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin can access all routes
  if (isAdmin) {
    console.log("Middleware - Admin access granted to:", pathname);
    return NextResponse.next();
  }

  // Non-admin users can't access admin routes
  if (!isAdmin && adminRoutes.some(route => pathname.startsWith(route))) {
    console.log("Middleware - Non-admin attempting to access admin route, redirecting");
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // Allow access to standard routes if authenticated
  console.log("Middleware - Access allowed");
  return NextResponse.next();
}

// Configure paths to protect
export const config = {
  matcher: [
    '/overview/:path*',
    '/requests/:path*',
    '/donors/:path*',
    '/stock/:path*',
    '/donorpledges/:path*',
    '/admins/:path*',
    '/users/:path*',
  ],
}