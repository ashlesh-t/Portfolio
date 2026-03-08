import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    const expectedUser = process.env.ADMIN_USERNAME || 'admin'
    const expectedPwd = process.env.ADMIN_PASSWORD || 'admin123'

    if (user === expectedUser && pwd === expectedPwd) {
      return NextResponse.next()
    }
  }
  
  // Also support a simpler token-based auth for API routes if needed
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = req.headers.get('authorization')
    if (authHeader && authHeader.split(' ')[1] === process.env.ADMIN_PASSWORD) {
        return NextResponse.next()
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: ['/adminmode/:path*', '/api/admin/:path*'],
}
