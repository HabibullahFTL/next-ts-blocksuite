import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Getting main & wildcard domain
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'marky.work';
  const wildcardDomain = `.${mainDomain}`;

  // Get hostname of request (e.g. demo.marky.work, demo.localhost:3000)
  const hostname = req.headers.get('host') || mainDomain;

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(wildcardDomain, '')
      : hostname.replace(`.localhost:3000`, '');

  // If main domain & not a reserved page, rewrite root application to `/app` folder
  const isReservedPaths = ['/404', '/_sites'].some((pagePath) =>
    path.startsWith(pagePath)
  );
  const isMainDomain = hostname === 'localhost:3000' || hostname === mainDomain;

  // Handling app and www sub domain
  if (
    currentHost == 'app' ||
    currentHost?.toLowerCase() == 'www' ||
    (isMainDomain && !isReservedPaths)
  ) {
    // Rewriting to app
    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  }
  // rewrite everything else to `/_sites/[site] dynamic route
  if (path.startsWith(`/_sites`)) {
    // Redirecting to /404 page
    return NextResponse.redirect(new URL('/404', url.origin));
  } else if (!path.startsWith(`/404`)) {
    // Re-writing to sites if not /404 page
    return NextResponse.rewrite(
      new URL(`/_sites/${currentHost}${path}`, req.url)
    );
  }
}
