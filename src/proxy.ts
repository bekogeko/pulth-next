import {NextResponse, userAgent} from 'next/server'
import type {NextRequest} from 'next/server'


// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {

    const ua = userAgent(request);

    if (ua.isBot) {
        console.log("BOT DETECTED, SKIP");
        return NextResponse.next();
    }

    let url = request.nextUrl.clone()
    const hostname = url.pathname.startsWith("/genuine/static/") ? 'eu-assets.i.posthog.com' : 'eu.i.posthog.com'
    const requestHeaders = new Headers(request.headers)

    requestHeaders.set('host', hostname)

    url.protocol = 'https'
    url.hostname = hostname
    // url.port = 443
    url.pathname = url.pathname.replace(/^\/genuine/, '');

    return NextResponse.rewrite(url, {
        headers: requestHeaders,
        status: 200,
    })
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/genuine/:path*', '/genuine/static/:path*'],
}