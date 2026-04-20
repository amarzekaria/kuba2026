import { NextResponse } from "next/server";

export const revalidate = 3600;

const SHORTCODE_RE = /^[A-Za-z0-9_-]{6,20}$/;

function sanitize(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  return SHORTCODE_RE.test(s) ? s : null;
}

export async function GET() {
  const postId = sanitize(process.env.INSTAGRAM_POST_2 ?? "");

  return NextResponse.json(
    { postId, success: postId !== null },
    {
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
      },
    }
  );
}
