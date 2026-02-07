import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Vérifier si l'utilisateur a une session de vérification en cours
  const pendingSessionId = request.cookies.get('pending_verification_session')?.value

  if (pendingSessionId && pathname === '/') {
    // Rediriger vers la page de vérification
    const verificationUrl = new URL('/verify', request.url)
    verificationUrl.searchParams.set('sessionId', pendingSessionId)
    return NextResponse.redirect(verificationUrl)
  }

  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
