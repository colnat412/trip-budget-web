import { NextResponse, type NextRequest } from 'next/server';

import {
  AUTH_COOKIE_NAMES,
  DEFAULT_AUTH_REDIRECT_PATH,
  DEFAULT_UNAUTH_REDIRECT_PATH,
  PUBLIC_AUTH_PATHS,
  PUBLIC_PATHS,
} from './base/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Not auth with public path
  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );
  if (isPublicPath) {
    return NextResponse.next();
  }

  const isAuthenticated = AUTH_COOKIE_NAMES.some((cookieName) =>
    Boolean(request.cookies.get(cookieName)?.value),
  );

  const isPublicAuthPath = PUBLIC_AUTH_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );

  // If unauthenticated and accessing a protected route -> redirect to /login
  if (!isAuthenticated && !isPublicAuthPath) {
    const loginUrl = new URL(DEFAULT_UNAUTH_REDIRECT_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and accessing a public auth route (e.g. /login) -> redirect to /overview
  if (isAuthenticated && isPublicAuthPath) {
    const overviewUrl = new URL(DEFAULT_AUTH_REDIRECT_PATH, request.url);
    return NextResponse.redirect(overviewUrl);
  }

  // If authenticated and accessing root path '/' -> redirect to /overview
  if (pathname === '/') {
    const targetPath = isAuthenticated
      ? DEFAULT_AUTH_REDIRECT_PATH
      : DEFAULT_UNAUTH_REDIRECT_PATH;
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - Next.js internal files (_next/static, _next/image)
     * - favicon.ico
     * - static files with extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
