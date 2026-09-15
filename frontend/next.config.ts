import type { NextConfig } from 'next'

// Security headers applied to every response.
const baseSecurityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Reduce referrer information leakage
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not used by this app
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

// Normal application pages (including `/`): refuse to be framed at all
// (clickjacking protection). `frame-src` is the OTHER direction of framing —
// what this page may embed — and must stay permissive so the app can host the
// TideCloak Secure Web Enclave (SWE) login iframe, which may be served from any
// ORK the user re-homes to. Tighten `frame-src` to known Tide domains for
// production. `frame-src` is NOT a substitute for `frame-ancestors`.
const appPageHeaders = [
  ...baseSecurityHeaders,
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-src 'self' *" },
]

// TideCloak's SDK loads `/silent-check-sso.html` in a hidden SAME-ORIGIN iframe
// for silent session refresh. The global `DENY` above blocks it (Chrome:
// "Refused to display ... because it set 'X-Frame-Options' to 'deny'"). This one
// page only needs to be framable by our own origin — nothing wider. It embeds
// nothing itself, so it carries `frame-ancestors 'self'` (who may frame it),
// not `frame-src`.
const silentSsoHeaders = [
  ...baseSecurityHeaders,
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Every path EXCEPT the TideCloak silent-SSO page.
        source: '/((?!silent-check-sso\\.html).*)',
        headers: appPageHeaders,
      },
      {
        // Only the TideCloak silent-SSO page — same-origin framing allowed.
        source: '/silent-check-sso.html',
        headers: silentSsoHeaders,
      },
    ]
  },
}

export default nextConfig
