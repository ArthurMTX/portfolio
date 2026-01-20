import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest} from 'next/server';
 
export default function middleware(request: NextRequest) {
  // Check for stored locale preference in cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // If user has a saved preference and is on root path, redirect to preferred locale
  if (cookieLocale && request.nextUrl.pathname === '/') {
    return Response.redirect(new URL(`/${cookieLocale}`, request.url));
  }
  
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  
  return response;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en)/:path*']
};