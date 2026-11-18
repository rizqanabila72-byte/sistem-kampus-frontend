import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookies
  const token = request.cookies.get('token')?.value;

  // 2. Cek apakah user sedang mengakses rute /dashboard (dan sub-rutenya)
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  // 3. Cek apakah user sedang mengakses rute /login
  const isLoginRoute = request.nextUrl.pathname === '/login';

  // LOGIKA PROTEKSI:
  
  // Jika mencoba masuk ke /dashboard tapi tidak punya token, lempar ke /login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika mencoba masuk ke /login tapi sudah punya token, langsung ke /dashboard
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika kondisi aman, lanjutkan request
  return NextResponse.next();
}

// Menentukan di rute mana saja middleware ini dijalankan
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};