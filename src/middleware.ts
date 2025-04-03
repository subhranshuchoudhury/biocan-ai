import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    const publicPaths = ['/login']
    const currentPath = request.nextUrl.pathname

    const isPublicPath = publicPaths.includes(currentPath)

    if (!token && !isPublicPath) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    if (token && isPublicPath) {
        const dashboardUrl = new URL('/home', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/login',
    ]
}