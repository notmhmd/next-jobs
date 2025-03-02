import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/candidates']
const publicRoutes = ['/login', '/signup', '/welcome', '/'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    const token = req.cookies.get('token')
    const isAuthenticated = Boolean(token)

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/candidates', req.nextUrl))
    }


    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}