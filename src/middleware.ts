import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return NextResponse.next();
  }

  // Allow access to dashboard only for authenticated users
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
};