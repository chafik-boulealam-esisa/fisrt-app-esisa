import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/users') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Check if user account is active
    if (token && !token.isActive) {
      return NextResponse.redirect(new URL('/login?error=account_disabled', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/students/:path*',
    '/users/:path*',
    '/profile/:path*',
  ],
};
