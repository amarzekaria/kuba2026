import { NextResponse } from "next/server";

/**
 * Returns the latest Instagram post shortcode.
 *
 * HOW TO SET THE FALLBACK (do this once after every new post):
 *  1. Open your latest Instagram post – URL looks like:
 *       https://www.instagram.com/p/ABC123xyz/
 *  2. Copy the part after /p/  →  ABC123xyz
 *  3. In the Vercel dashboard → Settings → Environment Variables, set:
 *       INSTAGRAM_LATEST_POST = ABC123xyz
 *  4. Redeploy (or Vercel picks it up on the next build automatically).
 *
 * The route tries two live sources first; if both are blocked by Meta,
 * it uses the env-var fallback so a real post always shows.
 *
 * SECURITY:
 *  - No user input is accepted (GET-only, zero query params read).
 *  - Every value extracted from external sources is validated with a strict
 *    regex before it is ever returned.
 *  - `revalidate = 3600` makes Vercel's CDN cache the response for one hour,
 *    so the serverless function runs at most ~24 times/day regardless of
 *    how many times the endpoint is called — no abuse risk.
 *  - Response headers prevent MIME-sniffing and forbid framing this API route.
 */

// ── CDN cache: one hour ──────────────────────────────────────────────────────
export const revalidate = 3600;

const IG_USERNAME = "memphiskuba2026";

// Instagram shortcodes: 6–20 base64-url characters.  Anything else is rejected.
const SHORTCODE_RE = /^[A-Za-z0-9_-]{6,20}$/;

function sanitize(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  return SHORTCODE_RE.test(s) ? s : null;
}

// ── Dynamic fetchers (best-effort; Meta frequently blocks these) ─────────────

async function tryRSSHub(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://rsshub.app/instagram/user/${IG_USERNAME}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const xml = await res.text();
    // Pull every /p/{shortcode}/ occurrence, validate, return the first.
    for (const [, raw] of xml.matchAll(/instagram\.com\/p\/([^/"]+)\//g)) {
      const sc = sanitize(raw);
      if (sc) return sc;
    }
  } catch {
    /* blocked — fall through */
  }
  return null;
}

async function tryProfileJSON(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.instagram.com/${IG_USERNAME}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) " +
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    // Safely navigate deeply-nested structure — any missing key returns null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    const raw =
      data?.graphql?.user?.edge_owner_to_timeline_media?.edges?.[0]?.node
        ?.shortcode ?? null;
    return sanitize(raw);
  } catch {
    /* blocked — fall through */
  }
  return null;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function GET() {
  // 1. Try live sources in order
  const dynamic = (await tryRSSHub()) ?? (await tryProfileJSON());

  // 2. If both blocked, use the env-var fallback the admin set
  const envFallback = sanitize(process.env.INSTAGRAM_LATEST_POST ?? "");

  const postId = dynamic ?? envFallback;

  return NextResponse.json(
    { postId, success: postId !== null },
    {
      headers: {
        // CDN caches this; stale-while-revalidate serves immediately while
        // the next background refresh runs.
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300",
        // Prevent MIME-type sniffing attacks
        "X-Content-Type-Options": "nosniff",
        // This is an API endpoint — it must never be embedded in a frame
        "X-Frame-Options": "DENY",
        // No referrer information leaked when the API calls external URLs
        "Referrer-Policy": "no-referrer",
      },
    }
  );
}
