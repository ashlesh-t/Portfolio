import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Resource routes that are publicly readable (GET) but whose mutations
// (POST/PUT/PATCH/DELETE) are admin-only, since the admin dashboard calls
// them directly rather than through /api/admin.
const PUBLIC_READ_PREFIXES = [
  '/api/projects',
  '/api/publications',
  '/api/experience',
  '/api/achievements',
  '/api/certifications',
  '/api/blogs',
  '/api/research',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublicReadRoute = PUBLIC_READ_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isPublicReadRoute && req.method === 'GET') {
    return NextResponse.next()
  }

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPwd = process.env.ADMIN_PASSWORD

  // Fail closed: without configured admin credentials, no request can pass.
  if (!expectedUser || !expectedPwd) {
    return new NextResponse('Admin credentials are not configured', { status: 503 })
  }

  const basicAuth = req.headers.get('authorization')
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === expectedUser && pwd === expectedPwd) {
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
  matcher: [
    '/adminmode/:path*',
    '/api/admin/:path*',
    '/api/projects/:path*',
    '/api/publications/:path*',
    '/api/experience/:path*',
    '/api/achievements/:path*',
    '/api/certifications/:path*',
    '/api/blogs/:path*',
    '/api/research/:path*',
  ],
}
