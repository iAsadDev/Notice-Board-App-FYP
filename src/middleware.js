import { NextResponse } from 'next/server';

// Simple token verification without external libraries
function verifyTokenSimple(token) {
  try {
    // Just check if token exists and is in correct format
    // We don't actually verify the signature in middleware
    // The actual verification happens in API routes
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);

  // Simple check - try to parse token if it exists
  let user = null;
  if (token) {
    try {
      user = verifyTokenSimple(token);
    } catch (error) {
      console.error('Token parsing failed:', error);
    }
  }

  // Redirect logic
  if (!user && !isPublicPath) {
    // If not authenticated and trying to access protected route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isPublicPath && pathname !== '/') {
    // If authenticated and trying to access public route (login/register)
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Admin routes protection - check role from token
  if (pathname.startsWith('/admin') && user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*', '/admin/:path*'],
};